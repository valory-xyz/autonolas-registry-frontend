import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  isL1OnlyNetwork as isL1OnlyNetworkFn,
  isL1Network as isL1NetworkFn,
} from '@autonolas/frontend-library';

import { setChainId } from 'store/setup/actions';
import { URL } from 'util/constants';
import {
  doesNetworkHaveValidServiceManagerTokenFn,
  getChainId,
  getIsValidChainId,
} from '../functions';

export const useHelpers = () => {
  const dispatch = useDispatch();
  const account = useSelector((state) => state?.setup?.account);
  const chainId = useSelector((state) => state?.setup?.chainId);
  const chainDisplayName = useSelector(
    (state) => state?.setup?.chainDisplayName,
  );
  const chainName = useSelector((state) => state?.setup?.chainName);

  /**
   * Set chainId to redux on page load.
   * This should be single source of truth for chainId
   */
  const currentChainId = getChainId();
  useEffect(() => {
    if (currentChainId !== chainId) {
      dispatch(setChainId(currentChainId));
    }
  }, [currentChainId]);

  const updatedLinks = Object.entries(URL).reduce((acc, [key, value]) => {
    acc[key] = `/${chainName}${value}`;
    return acc;
  }, {});

  return {
    account,
    chainId,
    chainDisplayName,
    chainName,
    isValidChainId: getIsValidChainId(chainId),
    isL1OnlyNetwork: isL1OnlyNetworkFn(chainId),
    isL1Network: isL1NetworkFn(chainId),
    doesNetworkHaveValidServiceManagerToken:
      doesNetworkHaveValidServiceManagerTokenFn(chainId),
    links: updatedLinks,
  };
};
