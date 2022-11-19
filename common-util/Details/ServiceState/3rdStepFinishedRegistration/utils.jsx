/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
import { ethers } from 'ethers';
import {
  GNOSIS_SAFE_CONTRACT,
  MULTI_SEND_CONTRACT,
} from 'common-util/AbiAndAddresses';
import {
  rpcUrl,
  getSignMessageLibContract,
  getServiceOwnerMultisigContract,
  getMultiSendContract,
  safeMultiSend,
  signMessageLibAddresses,
} from 'common-util/Contracts';
// import { walletConnectInit } from './wallectConnector';

const safeContracts = require('@gnosis.pm/safe-contracts');

const EIP712_SAFE_TX_TYPE = {
  SafeTx: [
    { type: 'address', name: 'to' },
    { type: 'uint256', name: 'value' },
    { type: 'bytes', name: 'data' },
    { type: 'uint8', name: 'operation' },
    { type: 'uint256', name: 'safeTxGas' },
    { type: 'uint256', name: 'baseGas' },
    { type: 'uint256', name: 'gasPrice' },
    { type: 'address', name: 'gasToken' },
    { type: 'address', name: 'refundReceiver' },
    { type: 'uint256', name: 'nonce' },
  ],
};

export const handleMultisigSubmit = async ({
  multisig,
  threshold,
  agentInstances,
  serviceOwner,
  chainId,
  handleStep3Deploy,
  radioValue,
  account,
}) => {
  // const multisigContract = getServiceOwnerMultisigContract(multisig);

  const multisigContract = new ethers.Contract(
    multisig,
    GNOSIS_SAFE_CONTRACT.abi,
    ethers.getDefaultProvider(rpcUrl[chainId]),
  );

  const nonce = await multisigContract.nonce();

  const callData = [];
  const txs = [];

  // Add the addresses, but keep the threshold the same
  for (let i = 0; i < agentInstances.length; i += 1) {
    callData[i] = multisigContract.interface.encodeFunctionData(
      'addOwnerWithThreshold',
      [agentInstances[i], 1],
    );
    txs[i] = safeContracts.buildSafeTransaction({
      to: multisig,
      data: callData[i],
      nonce: 0,
    });
  }

  callData.push(
    multisigContract.interface.encodeFunctionData('removeOwner', [
      agentInstances[0],
      serviceOwner,
      threshold,
    ]),
  );
  txs.push(
    safeContracts.buildSafeTransaction({
      to: multisig,
      data: callData[callData.length - 1],
      nonce: 0,
    }),
  );

  // const multiSendContract = getMultiSendContract(safeMultiSend[chainId][0]);
  const multiSendContract = new ethers.Contract(
    safeMultiSend[chainId][0],
    MULTI_SEND_CONTRACT.abi,
    ethers.getDefaultProvider(rpcUrl[chainId]),
  );

  const safeTx = safeContracts.buildMultiSendSafeTx(
    multiSendContract,
    txs,
    nonce,
  );

  // signer
  const provider = new ethers.providers.Web3Provider(
    window.web3.currentProvider,
    'any',
  );
  await provider.send('eth_requestAccounts', []);

  //
  try {
    const code = await provider.getCode(account);
    // TODO: check if we are dealing with safe in future!
    if (code !== '0x') {
      // gnosis-safe
      console.log('GNOSIS-SAFE');

      // const serviceOwnerMultisigContract = getServiceOwnerMultisigContract(account);

      const serviceOwnerMultisigContract = getServiceOwnerMultisigContract(account);

      const serviceOwnerThreshold = await serviceOwnerMultisigContract.methods
        .getThreshold()
        .call();

      // Create a message data from the multisend transaction
      const messageData = await multisigContract.encodeTransactionData(
        safeTx.to,
        safeTx.value,
        safeTx.data,
        safeTx.operation,
        safeTx.safeTxGas,
        safeTx.baseGas,
        safeTx.gasPrice,
        safeTx.gasToken,
        safeTx.refundReceiver,
        nonce,
      );

      const signMessageLibContract = getSignMessageLibContract(
        signMessageLibAddresses[chainId],
      );

      // const opts = {
      //   allowedDomains: [/gnosis-safe.io/],
      //   debug: true,
      // };

      // const appsSdk = new SafeAppsSDK(opts);
      // console.log(appsSdk);

      // // const safe = appsSdk.safe.getInfo();
      // const chain = await appsSdk.safe.getChainInfo();
      // console.log(chain);

      // txDataServiceMultisig.to = "0xA65387F16B013cf2Af4605Ad8aA5ec25a2cbA3a2";

      // let encodedMessageData = ethers.utils._TypedDataEncoder.encode({ verifyingContract: multisig, chainId },
      //   safeContracts.EIP712_SAFE_TX_TYPE, safeTx);

      // signMessageLibContract.methods
      //   .signMessage(messageData)
      //   .send({ from: account })
      //   .once('transactionHash', (hash) => console.log('sign-message-hash', hash)) // TODO: remove console
      //   .then((information) => console.log('sign-message-response', information)) // TODO: remove console
      //   .catch((e) => {
      //     console.error(e);
      //   });

      // const abc = await connector.signTypedData(messageData);
      // console.log(connector);

      // ======================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> MOHAN
      const walletProvider = new ethers.providers.Web3Provider(
        window.MODAL_PROVIDER,
      );
      console.log(walletProvider);

      const signer = walletProvider.getSigner();
      console.log(signer);

      const abcd = await signer._signTypedData(
        { verifyingContract: account, chainId },
        EIP712_SAFE_TX_TYPE,
        safeTx,
      );
      console.log(abcd);
      // ======================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> DAS

      // const signatureBytes2 = await signer.sendTransaction(
      //   {
      //     to: '0xA65387F16B013cf2Af4605Ad8aA5ec25a2cbA3a2',
      //     value: 0,
      //     data: messageData,
      //     // customData: {
      //     //   operation: 1,
      //     // },
      //     gasLimit: 2500000,
      //   },
      // );

      // console.log(signatureBytes2);

      // // const abc = await window.WEB3_PROVIDER.eth.sendSignedTransaction(messageData);
      // console.log(signer);

      // walletConnectInit();
      // Get the signature line
      // 12 bytes of padding + 20 bytes of address + 32 bytes of s + 1 byte of v
      const signatureLength = 65;
      // Calculate the s part length in hex with leading zeros padding to be 32 bytes in total
      const sPartPadded64 = (serviceOwnerThreshold * signatureLength)
        .toString(16)
        .padStart(64, '0'); // 65 in hex is 0x41
      const staticPart = `0x000000000000000000000000${account.slice(
        2,
      )}${sPartPadded64}00`; // r, s, v
      // Dynamic part consists of zero bytes of length equal to 65 bytes * threshold - first 65 initial ones + 32
      const dynamicPart = '00'.repeat(
        signatureLength * (serviceOwnerThreshold - 1) + 32,
      );
      const signatureBytes = staticPart + dynamicPart;

      console.log({
        safeTx,
        signatureBytes,
        messageData,
      });
      const safeExecData = multisigContract.interface.encodeFunctionData(
        'execTransaction',
        [
          safeTx.to,
          safeTx.value,
          safeTx.data,
          safeTx.operation,
          safeTx.safeTxGas,
          safeTx.baseGas,
          safeTx.gasPrice,
          safeTx.gasToken,
          safeTx.refundReceiver,
          signatureBytes,
        ],
      );

      // Redeploy the service updating the multisig with new owners and threshold
      const packedData = ethers.utils.solidityPack(
        ['address', 'bytes'],
        [multisig, safeExecData],
      );

      handleStep3Deploy(radioValue, packedData);
    } else {
      // metamask
      console.log('METAMASK');

      const signer = provider.getSigner();

      // Get the signature of a multisend transaction
      const signatureBytes = await signer._signTypedData(
        { verifyingContract: multisig, chainId },
        EIP712_SAFE_TX_TYPE,
        safeTx,
      );

      const safeExecData = multisigContract.interface.encodeFunctionData(
        'execTransaction',
        [
          safeTx.to,
          safeTx.value,
          safeTx.data,
          safeTx.operation,
          safeTx.safeTxGas,
          safeTx.baseGas,
          safeTx.gasPrice,
          safeTx.gasToken,
          safeTx.refundReceiver,
          signatureBytes,
        ],
      );

      const packedData = ethers.utils.solidityPack(
        ['address', 'bytes'],
        [multisig, safeExecData],
      );

      handleStep3Deploy(radioValue, packedData);
    }
  } catch (error) {
    console.log('Error in signing:');
    console.error(error);
  }
};
