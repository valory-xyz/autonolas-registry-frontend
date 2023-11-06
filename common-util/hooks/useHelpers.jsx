import { useSelector } from 'react-redux';
import {
  isL1OnlyNetwork as isL1OnlyNetworkFn,
  isL1Network as isL1NetworkFn,
} from '@autonolas/frontend-library';

import { URL } from 'util/constants';
import { doesNetworkHaveValidServiceManagerTokenFn } from '../functions';

export const useHelpers = () => {
  const account = useSelector((state) => state?.setup?.account);
  const chainId = useSelector((state) => state?.setup?.chainId);
  const chainDisplayName = useSelector(
    (state) => state?.setup?.chainDisplayName,
  );
  const chainName = useSelector((state) => state?.setup?.chainName);

  /**
   * Links with chain name
   * eg. /ethereum/agents, /goerli/agents
   */
  const updatedLinks = Object.entries(URL).reduce((acc, [key, value]) => {
    acc[key] = `/${chainName}${value}`;
    return acc;
  }, {});

  return {
    account,
    chainId,
    chainDisplayName,
    chainName,
    isL1OnlyNetwork: isL1OnlyNetworkFn(chainId),
    isL1Network: isL1NetworkFn(chainId),
    doesNetworkHaveValidServiceManagerToken:
      doesNetworkHaveValidServiceManagerTokenFn(chainId),
    links: updatedLinks,
  };
};
