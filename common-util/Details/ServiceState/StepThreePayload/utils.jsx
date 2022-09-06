/* eslint-disable no-underscore-dangle */
import {
  GNOSIS_SAFE_CONTRACT,
  MULTI_SEND_CONTRACT,
} from 'common-util/AbiAndAddresses';
import { safeMultiSend } from 'common-util/Contracts';
import { ethers } from 'ethers';

const safeContracts = require('@gnosis.pm/safe-contracts');

export const handleMultisigSubmit = async ({
  multisig,
  threshold,
  agentInstances,
  serviceOwner,
  chainId,
  handleStep3Deploy,
  radioValue,
}) => {
  // const data = ethers.utils.solidityPack(['address'], [multisig]);

  // const multisigContract = new ethers.Contract(
  //   multisig,
  //   GNOSIS_SAFE_CONTRACT.abi,
  //   ethers.getDefaultProvider('https://chain.staging.autonolas.tech/'),
  // );

  // const multisigContract = new ethers.utils.Interface(GNOSIS_SAFE_CONTRACT.abi);
  const multisigContract = new ethers.Contract(
    multisig,
    GNOSIS_SAFE_CONTRACT.abi,
    ethers.getDefaultProvider('https://chain.staging.autonolas.tech/'),
  );
  console.log({ multisigContract });

  const iface = new ethers.utils.Interface(GNOSIS_SAFE_CONTRACT.abi);
  const nonce = await multisigContract.nonce();
  const tttt = await multisigContract.getThreshold();

  console.log({
    iface, abc: iface.encodeFunctionData, nonce, tttt,
  });

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

  console.log({ callData, txs, multiSendAddress: safeMultiSend[31337] });

  const multiSendContract = new ethers.Contract(
    safeMultiSend[31337][0],
    MULTI_SEND_CONTRACT.abi,
    ethers.getDefaultProvider('https://chain.staging.autonolas.tech/'),
  );

  const safeTx = safeContracts.buildMultiSendSafeTx(
    multiSendContract,
    txs,
    nonce,
  );

  console.log({ safeTx });

  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
  // Prompt user for account connections
  await provider.send('eth_requestAccounts', []);
  const signer = provider.getSigner();
  console.log('Account:', await signer.getAddress());
  console.log(signer._signTypedData);

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

  // Get the signature of a multisend transaction
  const signatureBytes = await signer._signTypedData(
    { verifyingContract: multisig, chainId },
    EIP712_SAFE_TX_TYPE,
    safeTx,
  );

  console.log({ signatureBytes });

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

  // handleStep3Deploy(radioValue, packedData);
};
