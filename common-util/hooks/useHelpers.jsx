import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { isNumber } from 'lodash';
import { useNetwork } from 'wagmi';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import {
  isL1OnlyNetwork as isL1OnlyNetworkFn,
  isL1Network as isL1NetworkFn,
} from '@autonolas/frontend-library';

import { URL, VM_TYPE } from 'util/constants';
import { doesNetworkHaveValidServiceManagerTokenFn } from '../functions';

export const useHelpers = () => {
  const wallet = useAnchorWallet();

  const account = useSelector((state) => state?.setup?.account);
  const vmType = useSelector((state) => state?.setup?.vmType);

  // chainId - selected in the dropdown
  const chainId = useSelector((state) => state?.setup?.chainId);
  const chainDisplayName = useSelector(
    (state) => state?.setup?.chainDisplayName,
  );
  const chainName = useSelector((state) => state?.setup?.chainName);
  const { chain: chainFromWallet } = useNetwork();
  const chainIdFromWallet = chainFromWallet?.id;

  /**
   * Links with chain name
   * eg. /ethereum/agents, /goerli/agents
   */
  const updatedLinks = Object.entries(URL).reduce((acc, [key, value]) => {
    acc[key] = `/${chainName}${value}`;
    return acc;
  }, {});

  /**
   * @returns {boolean} - true if the wallet is connected to wrong network
   * (ie. chain ID from wallet is different from the chain ID selected in the dropdown)
   */
  const isConnectedToWrongNetwork = useMemo(() => {
    if (!isNumber(chainIdFromWallet) || !isNumber(chainId)) return false;

    return chainIdFromWallet !== chainId;
  }, [chainId, chainIdFromWallet]);

  const isSvm = vmType === VM_TYPE.SVM;

  return {
    /**
    * @type {string | import("@solana/web3.js").PublicKey}
     * account - selected in the dropdown
     * If SVM, account is the public key of the phantom wallet
     * else account is the address of the selected wallet
     */
    account: isSvm ? wallet?.publicKey : account,
    vmType,
    chainId,
    chainDisplayName,
    chainName,
    isL1OnlyNetwork: isL1OnlyNetworkFn(chainId),
    isL1Network: isL1NetworkFn(chainId),
    doesNetworkHaveValidServiceManagerToken:
      doesNetworkHaveValidServiceManagerTokenFn(chainId),
    links: updatedLinks,
    isConnectedToWrongNetwork,
    isSvm,
  };
};
