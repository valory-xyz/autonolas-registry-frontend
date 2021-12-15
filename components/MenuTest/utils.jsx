/* eslint-disable no-await-in-loop */
const { ethers } = require('ethers');

export const getProviderAndSigner = () => {
  console.log({ network: process.env.NEXT_PUBLIC_NETWORK });
  const itx = new ethers.providers.InfuraProvider(
    process.env.NEXT_PUBLIC_NETWORK,
    process.env.NEXT_PUBLIC_INFURA_PROJECT_ID,
  );

  const signer = new ethers.Wallet(process.env.NEXT_PUBLIC_SECRET_ID, itx);
  console.log(itx, signer);

  return { itx, signer };
};

export async function getBalance(itx, signer) {
  try {
    const response = await itx.send('relay_getBalance', [signer.address]);
    console.log(`Your current ITX balance is ${response.balance}`);
  } catch (e) {
    //
    console.log(e.error.message);
  }

  // try {
  //   const response = await fetch(
  //     `https://ropsten.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}#relay_getBalance`,
  //     {
  //       jsonrpc: '2.0',
  //       id: 0,
  //       method: 'relay_getBalance',
  //       params: ['0xc783df8a850f42e7F7e57013759C285caa701eB6'],
  //     },
  //   );

  //   console.log(response);
  // } catch (error) {
  //   console.error(error);
  // }
}

export async function deposit(signer) {
  const tx = await signer.sendTransaction({
    // ITX deposit contract (same address for all public Ethereum networks)
    to: '0x015C7C7A7D65bbdb117C573007219107BD7486f9',
    // Choose how much ether you want to deposit to your ITX gas tank
    value: ethers.utils.parseUnits('0.1', 'ether'),
  });
  // Waiting for the transaction to be mined
  await tx.wait();
}

export async function signRequest(tx, signer) {
  const relayTransactionHash = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ['address', 'bytes', 'uint', 'uint', 'string'],
      [tx.to, tx.data, tx.gas, 4, tx.schedule], // Rinkeby chainId is 4
    ),
  );
  const value = await signer.signMessage(
    ethers.utils.arrayify(relayTransactionHash),
  );
  return value;
}

export async function callContract(itx) {
  const iface = new ethers.utils.Interface(['function echo(string message)']);
  const data = iface.encodeFunctionData('echo', ['Hello world!']);
  const tx = {
    to: '0x6663184b3521bF1896Ba6e1E776AB94c317204B6',
    data,
    gas: '100000',
    schedule: 'fast',
  };
  const signature = await signRequest(tx);
  const relayTransactionHash = await itx.send('relay_sendTransaction', [
    tx,
    signature,
  ]);
  console.log(`ITX relay hash: ${relayTransactionHash}`);
  return relayTransactionHash;
}

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

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
    await wait(1000);
  }

  return null;
}

export const BB = null;
