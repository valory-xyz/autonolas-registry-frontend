/* eslint-disable no-await-in-loop */
import getConfig from 'next/config';
import { notification } from 'antd';

const { ethers } = require('ethers');

const { publicRuntimeConfig } = getConfig();
const { INFURA_PROJECT_ID, TEST_NETWORK, INFURA_TO_PUBLIC_ADDRESS } = publicRuntimeConfig;

/**
 * function to setup infura transaction (ITX) provider
 */
export const getProviderAndSigner = (privateKey) => {
  const itx = new ethers.providers.InfuraProvider(
    TEST_NETWORK,
    INFURA_PROJECT_ID,
  );
  const signer = new ethers.Wallet(privateKey, itx);

  return { itx, signer };
};

/**
 * function to show balance
 * @param {Object} itx
 * @param {Object} signer
 */
export async function getBalance(itx, signer) {
  try {
    const response = await itx.send('relay_getBalance', [signer.address]);
    return response;
  } catch (e) {
    console.error(e.error.message);
    return null;
  }
}

/**
 * function to deposit ETH
 * @param {Object} signer
 */
export async function deposit(signer, amount) {
  const tx = await signer.sendTransaction({
    // ITX deposit contract (same address for all public Ethereum networks)
    to: INFURA_TO_PUBLIC_ADDRESS,

    // ether you want to deposit to your ITX gas tank
    value: ethers.utils.parseUnits(amount, 'ether'),
  });

  notification.info({
    message: 'Depositted Successfully',
    description: `Amount: ${amount}`,
  });

  // Waiting for the transaction to be mined
  await tx.wait();
}

async function signRequest(tx, signer) {
  const relayTransactionHash = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ['address', 'bytes', 'uint', 'uint', 'string'],
      [tx.to, tx.data, tx.gas, 3, tx.schedule], // Ropsten chainId is 3
    ),
  );
  const value = await signer.signMessage(
    ethers.utils.arrayify(relayTransactionHash),
  );
  return value;
}

export async function callContract(itx, signer, toAddress, contractMessage) {
  const iface = new ethers.utils.Interface(['function echo(string message)']);
  const data = iface.encodeFunctionData('echo', [contractMessage]);
  const tx = {
    to: toAddress,
    data,
    gas: '50000',
    schedule: 'fast',
  };

  try {
    const signature = await signRequest(tx, signer);
    const relayTransactionHash = await itx.send('relay_sendTransaction', [
      tx,
      signature,
    ]);
    return relayTransactionHash;
  } catch (e) {
    console.error((e.error || '').message);
    return null;
  }
}

const wait = (milliseconds = 3000) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export async function waitTransaction(itx, relayTransactionHash) {
  let mined = false;

  while (!mined) {
    const statusResponse = await itx.send('relay_getTransactionStatus', [
      relayTransactionHash,
    ]);

    if (statusResponse.broadcasts) {
      for (let i = 0; i < statusResponse.broadcasts.length; i += 1) {
        const bc = statusResponse.broadcasts[i];
        const receipt = await itx.getTransactionReceipt(bc.ethTxHash);
        if (receipt && receipt.confirmations && receipt.confirmations > 1) {
          mined = true;
          return receipt;
        }
      }
    }
    await wait(3000);
  }

  return null;
}
