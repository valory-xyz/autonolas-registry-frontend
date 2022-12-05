import { ethers } from 'ethers';
import { get } from 'lodash';
import { safeSendTransactionNotification } from './index';


const getUrl = (hash, chainId) => {
  if (chainId === 5) { return `${process.env.NEXT_PUBLIC_GNOSIS_SAFE_API_GOERLI}/${hash}`; }
  return `${process.env.NEXT_PUBLIC_GNOSIS_SAFE_API_MAINNET}/${hash}`;
};

export async function pollTransactionDetails(hash, chainId) {
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
  extra,
  // {
  //   functionParams,
  //   sendParams,
  //   contract,
  //   startingBlock,
  //   eventFilters,
  // }
) => new Promise((resolve, reject) => {
  const {
    contract,
    eventFilters,
  } = extra;

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

        /**
         * 1. check if gnosis-safe?
         *    if yes => use `transactionHash`, get the hash
         *    then poll until we get the blockNumber
         *    then return the resolve with Output?
         * 2. if not-gnosis-safe use the custom
         */
        /* eslint-disable-next-line consistent-return */
        const interval = setInterval(async () => {
          window.console.log('Attempting to getPastEvents...');

          try {
            const filter = { owner: account, ...(eventFilters || {}) };
            const startingBlock = await provider.getBlockNumber();

            const pastEvents = await contract.getPastEvents('ApproveHash', {
              filter,
              fromBlock: startingBlock - 10,
              toBlock: 'latest',
            });
            window.console.log('pastEvents:', pastEvents);

            const hashApproved = pastEvents.length !== 0;
            if (hashApproved) {
              window.console.log('hashApproved');
              clearInterval(interval);
              return resolve();
            }
          } catch (error) {
            clearInterval(interval);
            return reject(error);
          }
        }, 5000);
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
