/* eslint-disable consistent-return */
import { get } from 'lodash';

const getUrl = (hash, chainId) => {
  if (chainId === 5) { return `${process.env.NEXT_PUBLIC_GNOSIS_SAFE_API_GOERLI}/${hash}`; }
  return `${process.env.NEXT_PUBLIC_GNOSIS_SAFE_API_MAINNET}/${hash}`;
};

export async function pollTransactionDetails(hash, chainId) {
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      window.console.log('Attempting to get transaction receipt...');

      try {
        const response = await fetch(getUrl(hash, chainId));
        const json = await response.json();
        const isRight = get(json, 'isSuccessful');

        if (isRight) {
          window.console.log('Transaction details: ', json);
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
