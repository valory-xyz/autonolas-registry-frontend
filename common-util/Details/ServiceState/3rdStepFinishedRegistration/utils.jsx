/* eslint-disable no-underscore-dangle */
import { ethers } from 'ethers';
import {
  GNOSIS_SAFE_CONTRACT,
  MULTI_SEND_CONTRACT,
} from 'common-util/AbiAndAddresses';
import { rpcUrl, safeMultiSend } from 'common-util/Contracts';

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
}) => {
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
};
