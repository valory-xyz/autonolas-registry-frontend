import {
  isValidAddress,
  getProvider as getProviderFn,
  getEthersProvider as getEthersProviderFn,
  // getChainId as getChainIdFn,
  getChainIdOrDefaultToMainnet as getChainIdOrDefaultToMainnetFn,
  getIsValidChainId as getIsValidChainIdFn,
  sendTransaction as sendTransactionFn,
} from '@autonolas/frontend-library';
import { RPC_URLS } from 'common-util/Contracts';
import { SUPPORTED_CHAINS } from 'common-util/Login';

export const getProvider = () => getProviderFn(SUPPORTED_CHAINS, RPC_URLS);

export const getEthersProvider = () => getEthersProviderFn(SUPPORTED_CHAINS, RPC_URLS);

export const getIsValidChainId = (chainId) => getIsValidChainIdFn(SUPPORTED_CHAINS, chainId);

export const getChainIdOrDefaultToMainnet = (chainId) => {
  const x = getChainIdOrDefaultToMainnetFn(SUPPORTED_CHAINS, chainId);
  return x;
};

export const getModalProvider = () => window?.MODAL_PROVIDER;
export const getWindowEthereum = () => window?.ethereum;
export const getChainIdFn = (supportedChains, chainId) => {
  // if window is undefined, we are in server side
  // return undefined
  if (typeof window === 'undefined') {
    console.error('No provider found');
    return undefined;
  }

  // if chainId is provided, return it
  if (chainId) {
    return Number(chainId);
  }

  // connected via wallet-connect
  const walletProvider = getModalProvider();
  if (walletProvider?.chainId) {
    const walletConnectChainId = walletProvider.chainId;
    return getChainIdOrDefaultToMainnetFn(
      supportedChains,
      walletConnectChainId,
    );
  }

  // NOT logged in but has wallet installed (eg. metamask).
  // window?.ethereum?.chainId is chainId set by wallet
  const windowEthereum = getWindowEthereum();
  if (windowEthereum?.chainId) {
    const walletChainId = windowEthereum.chainId;
    return getChainIdOrDefaultToMainnetFn(supportedChains, walletChainId);
  }

  // has no wallet (eg. incognito mode or no wallet installed)
  return supportedChains[0].id;
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
