import { ethers } from 'ethers';
import { safeSendTransactionNotification, notifySuccess, notifyError } from '.';

/**
 * poll until the hash has been approved before deploy
 */
export const sendTransaction = (
  sendFn,
  account,
  // {
  //   functionParams,
  //   sendParams,
  //   contract,
  //   startingBlock,
  //   eventFilters,
  // }
) => new Promise((resolve, reject) => {
  const provider = new ethers.providers.Web3Provider(
    window.MODAL_PROVIDER || window.web3.currentProvider,
    'any',
  );

  console.log(provider);
  console.log('105');

  provider
    .getCode(account)
    .then((code) => {
      console.log('code: ', code);
      const isGnosisSafe = code !== '0x';
      console.log('125');

      if (isGnosisSafe) {
        /**
           * Logic to deal with gnosis-safe
           * - show notification on to check gnosis-safe
           * - poll until transaction is completed
           * - return response
           */
        safeSendTransactionNotification();
      } else {
        console.log('127');
        sendFn
          .then((receipt) => {
            console.log('130');
            console.log('receipt', receipt);
            resolve(receipt);
          })
          .catch((e) => {
            reject(e);
          });
      }

      // /**
      //  * usual send function (right now supported by metamask)
      //  */

      // /**
      //    * 1. check if gnosis-safe?
      //    *    if yes => use `transactionHash`, get the hash
      //    *    then poll until we get the blockNumber
      //    *    then return the resolve with Output?
      //    * 2. if not-gnosis-safe use the custom
      //    */
      // // eslint-disable-next-line consistent-return
      // const interval = setInterval(async () => {
      //   window.console.log('Attempting to getPastEvents...');

      //   try {
      //     const pastEvents = await contract.getPastEvents('ApproveHash', {
      //       filter: eventFilters,
      //       fromBlock: startingBlock - 10,
      //       toBlock: 'latest',
      //     });
      //     window.console.log('pastEvents:', pastEvents);

      //     const hashApproved = pastEvents.length !== 0;
      //     if (hashApproved) {
      //       window.console.log('hashApproved');
      //       clearInterval(interval);
      //       return resolve();
      //     }
      //   } catch (error) {
      //     clearInterval(interval);
      //     return reject(error);
      //   }
      // }, 5000);
    })
    .catch(() => {
      console.error('Error on fetching code');
    });
});
