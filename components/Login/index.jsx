import { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { Button } from 'antd';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { CHAIN_ID, CONSTANTS } from 'util/constants';
import {
  setUserAccount as setUserAccountFn,
  setUserBalance as setUserBalanceFn,
  setErrorMessage as setErrorMessageFn,
  setLoaded as setLoadedFn,
} from 'store/setup/actions';
import { EllipsisMiddle } from 'common-util/List/ListTable/helpers';
import { Container, DetailsContainer, MetamaskContainer } from './styles';

const Login = ({
  isLoaded,
  account,
  balance,
  errorMessage,
  setUserAccount,
  setUserBalance,
  setErrorMessage,
  setLoaded,
}) => {
  const { library } = useWeb3React();

  const getBalance = (accoundPassed) => {
    window.ethereum
      .request({
        method: CONSTANTS.ETH_GETBALANCE,
        params: [accoundPassed, 'latest'],
      })
      .then((b) => {
        setUserBalance(ethers.utils.formatEther(b));
      })
      .catch((e) => {
        setErrorMessage(e.message);
      });
  };

  const handleLogin = async () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      // remove `disconnect` from localStorage
      localStorage.removeItem(CONSTANTS.DISCONNECT);

      // check if connected to the correct chain-id
      let isValidChainId = false;
      const getChainId = get(library, 'eth.net.getId');
      if (getChainId) {
        const network = await getChainId();
        if (network === CHAIN_ID) {
          isValidChainId = true;
          setErrorMessage(null);
        } else {
          isValidChainId = false;
          setUserAccount(null);
          setUserBalance(null);
          setErrorMessage(`Wrong network. Switch to chain ID: ${CHAIN_ID}`);
        }
      }

      // set user account & balance if chain-id is valid
      if (isValidChainId) {
        window.ethereum
          .request({ method: CONSTANTS.ETH_REQUESTACCOUNTS })
          .then((result) => {
            // setting only the 1st account
            setUserAccount(result[0]);
            getBalance(result[0]);
          })
          .catch((e) => {
            setErrorMessage(e.message);
          });
      }
    } else {
      setErrorMessage('Please install MetaMask browser extension');
    }
  };

  // set `disconenct` to localStorage for reference
  const handleDisconnect = () => {
    localStorage.setItem(CONSTANTS.DISCONNECT, true);
    setLoaded(false);
    setUserAccount(null);
    setUserBalance(null);
  };

  /**
   * if already loaded, set account and balance of the user.
   */
  useEffect(() => {
    if (isLoaded && !account) {
      handleLogin();
    }
  }, [isLoaded]);

  /**
   * listener for account, chain changes
   */
  const handleAccountChange = (newAccount) => {
    setUserAccount(newAccount);
    getBalance(newAccount.toString());
  };

  if (typeof window !== 'undefined' && window.ethereum) {
    window.ethereum.on('accountsChanged', handleAccountChange);
    window.ethereum.on('chainChanged', handleLogin);
  }

  if (errorMessage) {
    return (
      <Container>
        <MetamaskContainer data-testid="login-error">
          {errorMessage}
        </MetamaskContainer>
      </Container>
    );
  }

  if (!account) {
    return (
      <Container>
        <Button
          type="primary"
          onClick={handleLogin}
          data-testid="connect-metamask"
        >
          Connect MetaMask
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <DetailsContainer>
        <MetamaskContainer>
          <div>{balance ? `${balance} ETH` : 'NA'}</div>
          <div className="dash" />
          <EllipsisMiddle data-testid="metamask-address">
            {account ? `${account}` : 'NA'}
          </EllipsisMiddle>
          <Button type="primary" ghost onClick={handleDisconnect}>
            Disconnect
          </Button>
        </MetamaskContainer>
      </DetailsContainer>
    </Container>
  );
};

Login.propTypes = {
  isLoaded: PropTypes.bool,
  account: PropTypes.string,
  balance: PropTypes.string,
  errorMessage: PropTypes.string,
  setUserAccount: PropTypes.func.isRequired,
  setUserBalance: PropTypes.func.isRequired,
  setErrorMessage: PropTypes.func.isRequired,
  setLoaded: PropTypes.func.isRequired,
};

Login.defaultProps = {
  isLoaded: false,
  account: null,
  balance: null,
  errorMessage: null,
};

const mapStateToProps = (state) => {
  const {
    isLoaded, account, balance, errorMessage,
  } = get(state, 'setup', {});
  return {
    isLoaded,
    account,
    balance,
    errorMessage,
  };
};

const mapDispatchToProps = {
  setUserAccount: setUserAccountFn,
  setUserBalance: setUserBalanceFn,
  setErrorMessage: setErrorMessageFn,
  setLoaded: setLoadedFn,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
