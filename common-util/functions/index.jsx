import { ethers } from 'ethers';
import { notification } from 'antd';
import { STAGING_CHAIN_ID } from '@autonolas/frontend-library';
import { TOTAL_VIEW_COUNT, LOCAL_FORK_ID } from 'util/constants';

export const convertToEth = (value) => ethers.utils.formatEther(value);

/**
 * @example
 * TOTAL_VIEW_COUNT = 10
 * nextPage = 5
 * total = 45
 * first = ((5 - 1) * 10) + 1
 *      = (4 * 10) + 1
 *      = 41
 * last = min(5 * 10, 45)
 *      = 45
 */
export const getFirstAndLastIndex = (total, nextPage) => {
  const first = (nextPage - 1) * TOTAL_VIEW_COUNT + 1;
  const last = Math.min(nextPage * TOTAL_VIEW_COUNT, total);
  return { first, last };
};

// Nofitications
export const safeSendTransactionNotification = () => notification.warning({
  message: 'Please submit the transaction in your safe app.',
});

export const notifySuccess = (message = 'Successful') => notification.success({ message });
export const notifyError = (message = 'Some error occured') => notification.error({ message });

// functions
export const getChainId = (chainId = null) => {
  if (typeof window === 'undefined') return chainId;
  return Number(
    chainId
      || window?.CHAIN_ID // this is set in LoginV2.jsx (once wallet is connected)
      || window?.MODAL_PROVIDER?.chainId // set by web3modal
      || window?.ethereum?.chainId, // set by metamask (useful when wallet is not connected)
  );
};

export const isL1OnlyNetwork = (chainId) => {
  const chain = getChainId(chainId);
  return (
    chain === 1
    || chain === 5
    || chain === STAGING_CHAIN_ID
    || chain === LOCAL_FORK_ID
  );
};

/**
 * returns true if the chain is goerli or mainnet or local or null
 */
export const isL1Network = (chainId) => {
  const chain = getChainId(chainId);

  // even if chainId is null, we still show everything as shown in goerli or mainnet
  return isL1OnlyNetwork(chain) || chain === null;
};

export const isLocalNetwork = (chainId) => getChainId(chainId) === 31337;

export const isValidAddress = (address) => ethers.utils.isAddress(address);

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
