import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  isL1OnlyNetwork as isL1OnlyNetworkFn,
  isL1Network as isL1NetworkFn,
} from '@autonolas/frontend-library';

import { setChainId } from 'store/setup/actions';
import {
  doesNetworkHaveValidServiceManagerTokenFn,
  getChainId,
  getIsValidChainId,
} from '../functions';

export const useHelpers = () => {
  const dispatch = useDispatch();
  const account = useSelector((state) => state?.setup?.account);
  const chainId = useSelector((state) => state?.setup?.chainId);

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

  return {
    chainId,
    account,
    isValidChainId: getIsValidChainId(chainId),
    isL1OnlyNetwork: isL1OnlyNetworkFn(chainId),
    isL1Network: isL1NetworkFn(chainId),
    doesNetworkHaveValidServiceManagerToken:
      doesNetworkHaveValidServiceManagerTokenFn(chainId),
  };
};
