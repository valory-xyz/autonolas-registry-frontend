import { ethers } from 'ethers';
import get from 'lodash/get';
import { getMyProvider } from 'common-util/Contracts';
import { getChainId, safeSendTransactionNotification } from './index';

const getUrl = (hash, chainId) => {
  if (chainId === 5) {
    return `${process.env.NEXT_PUBLIC_GNOSIS_SAFE_API_GOERLI}/${hash}`;
  }
  return `${process.env.NEXT_PUBLIC_GNOSIS_SAFE_API_MAINNET}/${hash}`;
};

/**
 * poll gnosis-safe API every 3 seconds
 */
async function pollTransactionDetails(hash, chainId) {
  return new Promise((resolve, reject) => {
    /* eslint-disable-next-line consistent-return */
    const interval = setInterval(async () => {
      window.console.log('Fetching transaction receipt...');

      try {
        const response = await fetch(getUrl(hash, chainId));
        const json = await response.json();
        const isSuccessful = get(json, 'isSuccessful');

        if (isSuccessful) {
          window.console.log('Transaction details: ', json);
          clearInterval(interval);
          resolve(json);
        }
      } catch (error) {
        clearInterval(interval);
        reject(error);
      }
    }, 3000);
  });
}

/**
 * poll until the hash has been approved before deploy
 */
export const sendTransaction = (
  sendFn,
  account = window?.MODAL_PROVIDER?.accounts[0],
) => new Promise((resolve, reject) => {
  const provider = new ethers.providers.Web3Provider(getMyProvider(), 'any');

  provider
    .getCode(account)
    .then(async (code) => {
      const isGnosisSafe = code !== '0x';

      if (isGnosisSafe) {
        /**
           * Logic to deal with gnosis-safe
           * - show notification on to check gnosis-safe
           * - poll until transaction is completed
           * - return response
           */
        safeSendTransactionNotification();

        sendFn
          .on('transactionHash', async (safeTx) => {
            window.console.log('safeTx', safeTx);

            /**
               * use `transactionHash`, get the hash, then poll until
               * it resolves with Output
               */
            const chainId = getChainId();
            pollTransactionDetails(safeTx, chainId)
              .then((receipt) => {
                resolve(receipt);
              })
              .catch((e) => {
                console.error('Error on fetching transaction details');
                reject(e);
              });
          })
          .catch((e) => {
            reject(e);
          });
      } else {
        // usual send function
        sendFn.then((receipt) => resolve(receipt)).catch((e) => reject(e));
      }
    })
    .catch((e) => {
      console.error('Error on fetching code');
      reject(e);
    });
});
