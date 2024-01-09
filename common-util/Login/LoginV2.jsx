import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { SwapOutlined } from '@ant-design/icons';
import { isNil } from 'lodash';
import { Web3Modal, Web3Button } from '@web3modal/react';
import {
  useAccount,
  useBalance,
  useDisconnect,
  useNetwork,
  useSwitchNetwork,
} from 'wagmi';
import styled from 'styled-components';
import {
  COLOR,
  CannotConnectAddressOfacError,
  notifyError,
  useScreen,
} from '@autonolas/frontend-library';

import { setUserBalance } from 'store/setup/actions';
import { isAddressProhibited } from 'common-util/functions';
import { useHelpers } from 'common-util/hooks';
import { YellowButton } from 'common-util/YellowButton';
import { useRouter } from 'next/router';
import SolanaWallet from 'components/Login/SolanaWallet';
import { projectId, ethereumClient } from './config';

const LoginContainer = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;
  line-height: normal;
`;

export const LoginV2 = ({
  onConnect: onConnectCb,
  onDisconnect: onDisconnectCb,
  theme = 'light',
}) => {
  const dispatch = useDispatch();
  const { isMobile } = useScreen();
  const { disconnect } = useDisconnect();
  const { chainId, isConnectedToWrongNetwork } = useHelpers();
  const { chain: walletConnectedChain } = useNetwork();
  const { switchNetworkAsync, isLoading } = useSwitchNetwork();
  const router = useRouter();
  const { network } = router.query;

  const { address, connector } = useAccount({
    onConnect: ({ address: currentAddress }) => {
      if (isAddressProhibited(currentAddress)) {
        disconnect();
      } else if (onConnectCb && chainId) {
        onConnectCb({
          address: address || currentAddress,
          balance: null,
          chainId,
        });
      }
    },
    onDisconnect() {
      if (onDisconnectCb) onDisconnectCb();
    },
  });

  // Update the balance
  const { data: balance } = useBalance({ address, chainId });

  useEffect(() => {
    if (chainId && balance?.formatted) {
      dispatch(setUserBalance(balance.formatted));
    }
  }, [chainId, balance?.formatted]);

  useEffect(() => {
    const getData = async () => {
      try {
        // This is the initial `provider` that is returned when
        // using web3Modal to connect. Can be MetaMask or WalletConnect.
        const modalProvider = connector?.options?.getProvider?.()
          || (await connector?.getProvider?.());

        if (modalProvider) {
          // *******************************************************
          // ************ setting to the window object! ************
          // *******************************************************
          window.MODAL_PROVIDER = modalProvider;

          if (modalProvider?.on) {
            // https://docs.ethers.io/v5/concepts/best-practices/#best-practices--network-changes
            const handleChainChanged = () => {
              window.location.reload();
            };

            modalProvider.on('chainChanged', handleChainChanged);

            // cleanup
            return () => {
              if (modalProvider.removeListener) {
                modalProvider.removeListener(
                  'chainChanged',
                  handleChainChanged,
                );
              }
            };
          }
        }

        return () => null;
      } catch (error) {
        console.error(error);
        return () => null;
      }
    };

    if (connector && !isAddressProhibited(address)) {
      getData();
    }
  }, [address, connector]);

  // Disconnect if the address is prohibited
  useEffect(() => {
    if (address && isAddressProhibited(address)) {
      disconnect();
      notifyError(<CannotConnectAddressOfacError />);
      if (onDisconnectCb) onDisconnectCb();
    }
  }, [address]);

  const onSwitchNetwork = useCallback(async () => {
    try {
      await switchNetworkAsync(chainId);
    } catch (error) {
      console.error(error);
    }
  }, [chainId, switchNetworkAsync]);

  useEffect(() => {
    if (isConnectedToWrongNetwork) {
      onSwitchNetwork();
    }
  }, [isConnectedToWrongNetwork, onSwitchNetwork]);

  const hideWrongNetwork = isNil(walletConnectedChain?.id) || walletConnectedChain?.id === chainId;

  return (
    <LoginContainer>
      {!hideWrongNetwork && (
        <YellowButton
          loading={isLoading}
          type="default"
          onClick={onSwitchNetwork}
          icon={<SwapOutlined />}
        >
          {!isMobile && 'Switch network'}
        </YellowButton>
      )}
      &nbsp;&nbsp;
      {network === 'gnosis' ? (
        <SolanaWallet />
      ) : (
        <>
          <Web3Button avatar="hide" balance="hide" />
          <Web3Modal
            projectId={projectId}
            ethereumClient={ethereumClient}
            themeMode={theme}
            themeVariables={{
              '--w3m-button-border-radius': '5px',
              '--w3m-accent-color': COLOR.PRIMARY,
              '--w3m-background-color': COLOR.PRIMARY,
            }}
          />
        </>
      )}
    </LoginContainer>
  );
};

LoginV2.propTypes = {
  onConnect: PropTypes.func,
  onDisconnect: PropTypes.func,
  theme: PropTypes.string,
};

LoginV2.defaultProps = {
  onConnect: undefined,
  onDisconnect: undefined,
  theme: 'light',
};
