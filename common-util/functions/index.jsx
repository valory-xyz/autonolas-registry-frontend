import { ethers } from 'ethers';
import { toLower } from 'lodash';
import {
  isValidAddress,
  getChainIdOrDefaultToMainnet as getChainIdOrDefaultToMainnetFn,
  getIsValidChainId as getIsValidChainIdFn,
  sendTransaction as sendTransactionFn,
  isL1OnlyNetwork as isL1OnlyNetworkFn,
} from '@autonolas/frontend-library';
import { RPC_URLS } from 'common-util/Contracts';
import { SUPPORTED_CHAINS } from 'common-util/Login';
import { SUPPORTED_CHAINS_MORE_INFO } from 'common-util/Login/config';
import prohibitedAddresses from '../../data/prohibited-addresses.json';

export const getModalProvider = () => window?.MODAL_PROVIDER;

export const getWindowEthereum = () => window?.ethereum;

export const getProviderHelper = (chainId, rpcUrls) => {
  const rpcUrl = rpcUrls[chainId];

  if (!rpcUrl) {
    throw new Error(`No RPC URL found for chainId: ${chainId}`);
  }

  if (typeof window === 'undefined') {
    console.warn(
      'No provider found, fetching RPC URL from first supported chain',
    );
    return rpcUrl;
  }

  // connected via wallet-connect
  const walletProvider = getModalProvider();
  if (walletProvider) {
    return walletProvider;
  }

  // NOT logged in but has wallet installed (eg. Metamask).
  // If chainId is not supported, default to mainnet (ie. Use JSON-RPC provider)
  const windowEthereum = getWindowEthereum();
  if (windowEthereum?.chainId) {
    return windowEthereum;
  }

  // fallback to mainnet JSON RPC provider
  return rpcUrl;
};

export const getEthersProviderHelper = (chainId, rpcUrls) => {
  const provider = getProviderHelper(chainId, rpcUrls);

  // if provider is a string, it is a JSON-RPC provider
  if (typeof provider === 'string') {
    return new ethers.providers.JsonRpcProvider(provider);
  }

  return new ethers.providers.Web3Provider(provider, 'any');
};

export const getChainId = (chainId = null) => {
  if (chainId) return chainId;

  const chainIdfromSessionStorage = typeof sessionStorage === 'undefined'
    ? 1
    : Number(sessionStorage.getItem('chainId'));
  // console.log({ chainIdfromSessionStorage });

  if (
    !SUPPORTED_CHAINS_MORE_INFO.find((e) => e.id === chainIdfromSessionStorage)
  ) {
    return new Error('Invalid chain id');
  }

  return chainIdfromSessionStorage;
};

export const getProvider = () => {
  const provider = getProviderHelper(getChainId(), RPC_URLS);
  return provider;
};

export const getEthersProvider = () => getEthersProviderHelper(getChainId(), RPC_URLS);

export const getIsValidChainId = (chainId) => getIsValidChainIdFn(SUPPORTED_CHAINS, chainId);

export const getChainIdOrDefaultToMainnet = (chainId) => {
  const x = getChainIdOrDefaultToMainnetFn(SUPPORTED_CHAINS, chainId);
  return x;
};

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

export const getCustomNetworkName = (name) => {
  if (name === 'homestead') return 'mainnet';
  return name;
};

export const getCurrentChainInfo = (chainId) => {
  const chain = SUPPORTED_CHAINS_MORE_INFO.find((e) => e.id === chainId);
  // if (!chain) {
  //   throw new Error('Invalid chain id');
  // }

  return chain;
};

// export const getNetworkNameFromChainId = (chainId) => {
//   const chain = SUPPORTED_CHAINS_MORE_INFO.find((e) => e.id === chainId);
//   if (!chain) {
//     throw new Error('Invalid chain id');
//   }

//   return chain.network;
// };

/**
 * 1. users goes /components => redirect to mainnet/components
 * 2. users goes /goerli/components =>
 *  set chainId to 5 and make sure others are using this chainId
 * 3. users goes /random_text/components =>
 *  set chainId to 1 and make sure others are using this chainId
 * 4. dropdown changes => redirect to appropriate page
 */
