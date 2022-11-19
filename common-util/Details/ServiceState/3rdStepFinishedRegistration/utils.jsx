/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
import WalletConnect from '@walletconnect/browser';
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
  const multisigContractWeb3 = getServiceOwnerMultisigContract(multisig);

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

      const pro = walletProvider.provider;
      const walletConnector = new WalletConnect({
        bridge: pro.wc._bridge,
        // bridge: 'https://safe-walletconnect.gnosis.io',
        session: pro.wc.session,
        storageId: pro.wc._sessionStorage.storageId,
        uri: pro.wc.uri,
      });

      console.log(walletConnector);

      const customRequest = {
        id: 1,
        jsonrpc: '2.0',
        method: 'eth_sendTransaction',
        params: [
          {
            from: account,
            to: "0xd46e8dd67c5d32be8058bb8eb970870f07244567",
            data:
              "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675",
          },
        ],
      };

      // const abcd = await walletConnector.unsafeSend(customRequest);
//       const abcd = await walletConnector.sendCustomRequest(customRequest);
//       console.log(abcd);
      // walletProvider.connection

      // const abcd = await walletProvider.send('eth_sendRawTransaction', safeTx);
      // console.log(abcd);

      // --------------------- GET SIGNER START ---------------------------
      const signer = walletProvider.getSigner();
      console.log(signer);

      ////////////////////////////// APPROVE HASH
      const messageDataHash = ethers.utils.keccak256(messageData);
      multisigContractWeb3.methods
         .approveHash(messageDataHash)
         .send({ from: account })
         .once('transactionHash', (hash) => console.log('sign-message-hash', hash)) // TODO: remove console
         .then((information) => console.log('sign-message-response', information)) // TODO: remove console
         .catch((e) => {
           console.error(e);
         });
      /////////////////////////////////////

//       const abcd = await signer.signMessage(messageData);
//       const abcd = await signer.(safeTx);
      // --------------------- GET SIGNER END ------------------------------

      // const abcd = await signer._signTypedData(
      //   { verifyingContract: multisig, chainId },
      //   EIP712_SAFE_TX_TYPE,
      //   safeTx,
      // );
      // console.log(abcd);
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

      // Get the signature bytes based on the account address, since it had its tx pre-approved
      const signatureBytes = "0x000000000000000000000000" + account.slice(2) +
        "0000000000000000000000000000000000000000000000000000000000000000" + "01";

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
