import { ethers } from 'ethers';
import { notification } from 'antd/lib';
import { STAGING_CHAIN_ID } from '@autonolas/frontend-library';
import { TOTAL_VIEW_COUNT } from 'util/constants';
import { ADDRESSES } from 'common-util/Contracts';

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

export const getChainId = (chainId = null) => {
  if (typeof window === 'undefined') return chainId;
  return Number(
    chainId || window?.MODAL_PROVIDER?.chainId || window?.ethereum?.chainId,
  );
};

export const isL1OnlyNetwork = (chainId) => {
  const chain = getChainId(chainId);
  return chain === 5 || chain === 1 || chain === STAGING_CHAIN_ID;
};

/**
 * returns true if the chain is goerli or mainnet or local or null
 */
export const isL1Network = (chainId) => {
  const chain = getChainId(chainId);

  // even if chainId is null, we still show everything as shown in goerli or mainnet
  return isL1OnlyNetwork(chain) || chain === null;
};

export const isGoerli = (chainId) => getChainId(chainId) === 5;

export const isGnosis = (chainId) => getChainId(chainId) === 100;

export const isPolygon = (chainId) => getChainId(chainId) === 137;

export const isPolygonMumbai = (chainId) => getChainId(chainId) === 80001;

export const getSupportedNetworks = () => Object.keys(ADDRESSES).map((e) => Number(e));

export const isLocalNetwork = (chainId) => getChainId(chainId) === 31337;
