import { ethers } from 'ethers';
import { get } from 'lodash';
import { safeSendTransactionNotification } from './index';

const getUrl = (hash, chainId) => {
  if (chainId === 5) {
    return `${process.env.NEXT_PUBLIC_GNOSIS_SAFE_API_GOERLI}/${hash}`;
  }
  return `${process.env.NEXT_PUBLIC_GNOSIS_SAFE_API_MAINNET}/${hash}`;
};

async function pollTransactionDetails(hash, chainId) {
  return new Promise((resolve, reject) => {
    /* eslint-disable-next-line consistent-return */
    const interval = setInterval(async () => {
      window.console.log('Attempting to get transaction receipt...');

      try {
        const response = await fetch(getUrl(hash, chainId));
        const json = await response.json();
        const isSuccessful = get(json, 'isSuccessful');

        if (isSuccessful) {
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

/**
 * poll until the hash has been approved before deploy
 */
export const sendTransaction = (
  sendFn,
  account,
  // extra,
) => new Promise((resolve, reject) => {
  // const { contract, eventFilters } = extra;

  const provider = new ethers.providers.Web3Provider(
    window.MODAL_PROVIDER || window.web3.currentProvider,
    'any',
  );

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
          .on('transactionHash', async (hash) => {
            window.console.log('safeTx', hash);

            /**
               * use `transactionHash`, get the hash, then poll until
               * it resolves with Output
               */
            const chainId = await window.WEB3_PROVIDER.eth.getChainId();
            pollTransactionDetails(chainId, chainId)
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
        /**
           * usual send function (right now supported by metamask)
           */

        sendFn
          .then((receipt) => {
            resolve(receipt);
          })
          .catch((e) => {
            reject(e);
          });
      }
    })
    .catch(() => {
      console.error('Error on fetching code');
    });
});

/**
 * 1-1 oak
 * David V will give the contract
 * get the gas-cost before miniting - if possible
 *
 * To show badge
 * see any badeges ? badge : else show button to mint
 * => take the 1st badge =>
 *
 * style the sheet if possible
 *
 * on close, keep it in local-storage
 *
 * for responsinvess => just collapse to single column
 */
