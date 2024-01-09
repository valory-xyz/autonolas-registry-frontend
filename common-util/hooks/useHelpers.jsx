import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { isNumber } from 'lodash';
import { useNetwork } from 'wagmi';
import {
  isL1OnlyNetwork as isL1OnlyNetworkFn,
  isL1Network as isL1NetworkFn,
} from '@autonolas/frontend-library';

import { URL } from 'util/constants';
import { doesNetworkHaveValidServiceManagerTokenFn } from '../functions';

export const useHelpers = () => {
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

  return {
    account,
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
  };
};
