import {
  isValidAddress,
  getChainIdOrDefaultToMainnet as getChainIdOrDefaultToMainnetFn,
  getChainId as getChainIdFn,
  notifyWarning,
} from '@autonolas/frontend-library';

import { SUPPORTED_CHAINS } from 'common-util/Login';

// Nofitications
export const safeSendTransactionNotification = () => notifyWarning({
  message: 'Please submit the transaction in your safe app.',
});

export const getIsValidChainId = (chainId) => {
  if (!chainId) return false;
  return SUPPORTED_CHAINS.some((e) => e.id === Number(chainId));
};

/**
 * helper function to get chainId, if chainId is not supported, default to mainnet
 * @param {number | string} chainIdPassed valid chainId
 * @returns
 */
export const getChainIdOrDefaultToMainnet = (chainIdPassed) => {
  const x = getChainIdOrDefaultToMainnetFn(SUPPORTED_CHAINS, chainIdPassed);
  return x;
};

/**
 *
 * @param {Number} chainId
 * @returns {Number} valid chainId & defaults to mainnet if chainId is not supported
 */
export const getChainId = (chainId = null) => getChainIdFn(SUPPORTED_CHAINS, chainId);

export const isLocalNetwork = (chainId) => getChainId(chainId) === 31337;

export const addressValidator = () => ({
  validator(_, value) {
    return isValidAddress(value)
      ? Promise.resolve()
      : Promise.reject(new Error('Please enter valid addresses.'));
  },
});

// check if the provider is gnosis safe
export const checkIfGnosisSafe = async (account, provider) => {
  const code = await provider.getCode(account);
  return code !== '0x';
};
