import { toLower } from 'lodash';
import {
  isValidAddress,
  getProvider as getProviderFn,
  getEthersProvider as getEthersProviderFn,
  getChainId as getChainIdFn,
  getChainIdOrDefaultToMainnet as getChainIdOrDefaultToMainnetFn,
  getIsValidChainId as getIsValidChainIdFn,
  sendTransaction as sendTransactionFn,
  isL1OnlyNetwork as isL1OnlyNetworkFn,
} from '@autonolas/frontend-library';
import { RPC_URLS } from 'common-util/Contracts';
import { SUPPORTED_CHAINS } from 'common-util/Login';
import prohibitedAddresses from '../../data/prohibited-addresses.json';

export const getProvider = () => getProviderFn(SUPPORTED_CHAINS, RPC_URLS);

export const getEthersProvider = () => getEthersProviderFn(SUPPORTED_CHAINS, RPC_URLS);

export const getIsValidChainId = (chainId) => getIsValidChainIdFn(SUPPORTED_CHAINS, chainId);

export const getChainIdOrDefaultToMainnet = (chainId) => {
  const x = getChainIdOrDefaultToMainnetFn(SUPPORTED_CHAINS, chainId);
  return x;
};

export const getChainId = (chainId = null) => getChainIdFn(SUPPORTED_CHAINS, chainId);

export const sendTransaction = (fn, account) => sendTransactionFn(fn, account, {
  supportedChains: SUPPORTED_CHAINS,
  rpcUrls: RPC_URLS,
});

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

/**
 * Checks if the network has "Service Manager Token".
 * For now mainnet, goerli, gnosis & chiado has service manager token.
 */
export const doesNetworkHaveValidServiceManagerTokenFn = (chainId) => {
  const isL1 = isL1OnlyNetworkFn(chainId);
  return isL1 || chainId === 100 || chainId === 10200;
};

export const isAddressProhibited = (address) => {
  const addresses = prohibitedAddresses.map((e) => toLower(e));
  return addresses.includes(toLower(address));
};
