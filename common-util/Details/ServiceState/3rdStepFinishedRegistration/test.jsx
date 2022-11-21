/* eslint-disable consistent-return */
import { get } from 'lodash';

export const fetchTransactionDetails = () => {};

const getUrl = (hash, chainId) => {
  if (chainId === 5) return `https://safe-transaction-goerli.safe.global/api/v1/multisig-transactions/${hash}`;
  return `https://safe-transaction-mainnet.safe.global/api/v1/multisig-transactions/${hash}`;
};

export async function poll(hash, chainId) {
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      console.log('Attempting to get transaction receipt...');

      try {
        const response = await fetch(getUrl(hash, chainId));
        const json = await response.json();
        const isRight = get(json, 'isSuccessful');

        if (isRight) {
          clearInterval(interval);
          return resolve(json);
        }
      } catch (error) {
        clearInterval(interval);
        return reject(error);
      }
    }, 3000);
  });
}
