/* eslint-disable consistent-return */
import { get } from 'lodash';
// import Web3 from 'web3';

export const fetchTransactionDetails = () => {};

// const timer = (ms) => new Promise((res) => setTimeout(res, ms));

// const web3 = new Web3(window.WEB3_PROVIDER || window.web3.currentProvider);

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
