import { ethers } from 'ethers';
import { isString, toLower } from 'lodash';
import {
  isValidAddress,
  getChainIdOrDefaultToMainnet as getChainIdOrDefaultToMainnetFn,
  getIsValidChainId as getIsValidChainIdFn,
  sendTransaction as sendTransactionFn,
  isL1OnlyNetwork as isL1OnlyNetworkFn,
  notifyWarning,
  notifyError,
} from '@autonolas/frontend-library';
import { PublicKey } from '@solana/web3.js';

import { RPC_URLS } from 'common-util/Contracts';
import { SUPPORTED_CHAINS } from 'common-util/Login';
import {
  EVM_SUPPORTED_CHAINS,
  SVM_SUPPORTED_CHAINS,
} from 'common-util/Login/config';
import { VM_TYPE } from 'util/constants';
import prohibitedAddresses from '../../data/prohibited-addresses.json';

export const getModalProvider = () => window?.MODAL_PROVIDER;

export const getWindowEthereum = () => window?.ethereum;

export const getChainId = (chainId = null) => {
  if (chainId) return chainId;

  // chainId fetched from sessionStorage
  const chainIdfromSessionStorage = typeof sessionStorage === 'undefined'
    ? 1
    : Number(sessionStorage.getItem('chainId'));

  // if chainId is not supported, throw error
  if (!EVM_SUPPORTED_CHAINS.find((e) => e.id === chainIdfromSessionStorage)) {
    return new Error('Invalid chain id');
  }

  return chainIdfromSessionStorage || 1;
};

export const getProvider = () => {
  const defaultChainId = getChainId();
  const rpcUrl = RPC_URLS[defaultChainId];

  if (!rpcUrl) {
    throw new Error(`No RPC URL found for chainId: ${defaultChainId}`);
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
    const walletConnectChainId = Number(walletProvider.chainId);

    // if logged in via wallet-connect but chainId is not supported,
    // default to mainnet (ie. Use JSON-RPC provider)
    return walletConnectChainId === defaultChainId ? walletProvider : rpcUrl;
  }

  // NOT logged in but has wallet installed (eg. Metamask).
  // If chainId is not supported, default to mainnet (ie. Use JSON-RPC provider)
  const windowEthereum = getWindowEthereum();
  if (windowEthereum?.chainId) {
    const walletChainId = Number(windowEthereum.chainId);

    return walletChainId === defaultChainId ? windowEthereum : rpcUrl;
  }

  // fallback to mainnet JSON RPC provider
  return rpcUrl;
};

export const getEthersProvider = () => {
  const provider = getProvider();

  // if provider is a string, it is a JSON-RPC provider
  if (typeof provider === 'string') {
    return new ethers.providers.JsonRpcProvider(provider);
  }

  return new ethers.providers.Web3Provider(provider, 'any');
};

export const getIsValidChainId = (chainId) => getIsValidChainIdFn(SUPPORTED_CHAINS, chainId);

export const getChainIdOrDefaultToMainnet = (chainId) => {
  const x = getChainIdOrDefaultToMainnetFn(SUPPORTED_CHAINS, chainId);
  return x;
};

/**
 * Checks if the provided object is a MethodsBuilder object.
 * A MethodsBuilder object is expected to have certain properties that are
 * used to interact with the blockchain.
 *
 * @param {object} obj - The object to check.
 * @returns {boolean} - True if the object is a MethodsBuilder object, false otherwise.
 */
const isMethodsBuilderObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    throw new Error('sendTransaction: Input must be an object.');
  }
  // Check for a unique property that should always exist
  // eslint-disable-next-line no-underscore-dangle
  const hasProgramId = '_programId' in obj && obj._programId instanceof PublicKey;

  // Check for a complex property with a specific structure,
  // eslint-disable-next-line no-underscore-dangle
  const argsCorrect = Array.isArray(obj._args) && obj._args.length === 6;

  // Return true if both characteristic properties are as expected
  return hasProgramId && argsCorrect;
};

/**
 * Sends a transaction using the appropriate method based on the virtual machine type.
 * For SVM (Solana Virtual Machine), it uses the rpc method on the function.
 * For EVM (Ethereum Virtual Machine), it uses a generic sendTransaction function.
 *
 * @param {Function} method - The transaction method to be executed.
 * @param {string} account - The account address that is sending the transaction.
 *                           Only required when vmType is EVM
 * @param {string} vmType - The type of virtual machine ('svm' or 'evm).
 */
export const sendTransaction = (method, account, vmType) => {
  if (vmType === VM_TYPE.SVM) {
    if (!isMethodsBuilderObject(method)) {
      notifyError('Invalid method object');
      throw new Error('Invalid method object');
    }
    return method.rpc();
  }

  return sendTransactionFn(method, account, {
    supportedChains: SUPPORTED_CHAINS,
    rpcUrls: RPC_URLS,
  });
};

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

const doesPathIncludesComponents = (path) => !!path?.includes('components');
const doesPathIncludesAgents = (path) => !!path?.includes('agents');
export const doesPathIncludesServices = (path) => !!path?.includes('services');
export const doesPathIncludesComponentsOrAgents = (path) => {
  if (!path) return false;
  return doesPathIncludesComponents(path) || doesPathIncludesAgents(path);
};

export const notifyWrongNetwork = () => {
  notifyWarning('Please switch to the correct network and try again');
};

// functions for solana
export const isPageWithSolana = (path) => {
  if (!path) return false;
  if (!isString(path)) return false;

  const checkPath = (e) => path.toLowerCase().includes(e.networkName.toLowerCase());
  return SVM_SUPPORTED_CHAINS.some(checkPath);
};

export const isValidSolanaPublicKey = (publicKey) => PublicKey.isOnCurve(publicKey);
