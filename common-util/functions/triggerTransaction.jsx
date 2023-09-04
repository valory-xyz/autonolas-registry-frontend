import { isGnosis, isGoerli, isPolygon } from '@autonolas/frontend-library';
import get from 'lodash/get';
import { getWeb3Details } from 'common-util/Contracts';
import { ethers } from 'ethers';
import { getChainId, safeSendTransactionNotification } from './index';

/**
 * @returns {string} - url of gnosis-safe API.
 * List of available gnosis safe transaction service
 * https://docs.safe.global/safe-core-api/available-services
 */
const getUrl = (hash, chainId) => {
  switch (chainId) {
    case isGoerli(chainId):
      return `${process.env.NEXT_PUBLIC_GNOSIS_SAFE_API_GOERLI}/${hash}`;
    case isGnosis(chainId):
      return `${process.env.NEXT_PUBLIC_GNOSIS_SAFE_API_GNOSIS}/${hash}`;
    case isPolygon(chainId):
      return `${process.env.NEXT_PUBLIC_GNOSIS_SAFE_API_POLYGON}/${hash}`;
    default:
      return `${process.env.NEXT_PUBLIC_GNOSIS_SAFE_API_MAINNET}/${hash}`;
  }
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
export const triggerTransaction = async (
  sendTransactionInfo,
  account = window?.MODAL_PROVIDER?.accounts[0],
) => {
  const { provider } = getWeb3Details();

  try {
    const txResponse = await sendTransactionInfo;
    const code = await provider.getCode(account);
    console.log(txResponse);

    const isGnosisSafe = code !== '0x';

    if (isGnosisSafe) {
      /**
       * Logic to deal with gnosis-safe
       * - show notification on to check gnosis-safe
       * - poll until transaction is completed
       * - return response
       */
      safeSendTransactionNotification();

      const safeTx = txResponse.wait();
      window.console.log('safeTx', safeTx);

      /**
       * use `transactionHash`, get the hash, then poll until
       * it resolves with Output
       */
      const chainId = getChainId();
      try {
        const receipt = await pollTransactionDetails(safeTx, chainId);
        return receipt;
      } catch (error) {
        console.error('Error on fetching transaction details');
        throw error;
      }
    } else {
      // not safe, so just wait for the transaction to be mined
      const receipt = txResponse.wait();
      return receipt;
    }
  } catch (error) {
    window.console.error('Error occured while sending transaction');
    throw error;
  }
};

// * @param {ethers.providers} signer - signer

/**
 * sign the transaction
 * @param {object} message - transaction object
 * @param {ethers.Signer} signer - signer
 *
 */
export const sendTransactionHelper = async (message, signer) => {
  try {
    const { provider } = getWeb3Details();

    console.log({
      provider,
    });

    const gasPrice = await provider.getGasPrice();
    console.log({
      gasPrice,
    });

    const tx = {
      ...message,

      // gasPrice: ethers.utils.hexlify(parseInt(gasPrice, 10)),
    };
    const code = await provider.getCode(message.from);
    const isGnosisSafe = code !== '0x';

    console.log({
      tx,
      code,
      isGnosisSafe,
    });

    if (isGnosisSafe) {
      /**
       * Logic to deal with gnosis-safe
       * - show notification on to check gnosis-safe
       * - poll until transaction is completed
       * - return response
       */
      safeSendTransactionNotification();
      const signedTx = await signer.signTransaction(tx);
      console.log('txResponse', signedTx);
      // const signedTx = tx;

      const txResponse = provider.sendTransaction(signedTx);
      console.log('txResponse', txResponse);
    } else {
      // ff
    }
  } catch (error) {
    console.error(error);
  }
};
