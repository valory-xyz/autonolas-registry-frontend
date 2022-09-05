import {
  GNOSIS_SAFE_CONTRACT,
  MULTI_SEND_CONTRACT,
} from 'common-util/AbiAndAddresses';
import { ethers } from 'ethers';

const safeContracts = require('@gnosis.pm/safe-contracts');

export const handleMultisigSubmit = async ({
  multisig,
  threshold,
  agentInstances,
  serviceOwner,
}) => {
  const data = ethers.utils.solidityPack(['address'], [multisig]);

  // const multisigContract = new ethers.Contract(
  //   multisig,
  //   GNOSIS_SAFE_CONTRACT.abi,
  //   ethers.getDefaultProvider('https://chain.staging.autonolas.tech/'),
  // );

  // const multisigContract = new ethers.utils.Interface(GNOSIS_SAFE_CONTRACT.abi);
  const multisigContract = new ethers.Contract(
    multisig,
    GNOSIS_SAFE_CONTRACT.abi,
    'https://chain.staging.autonolas.tech/',
  );
  const abiCoder = ethers.utils.defaultAbiCoder;

  console.log({ abiCoder });

  // const nonce = await multisigContract.nonce();

  // console.log(agentInstances);
  console.log({
    multisig,
    data,
    threshold,
    multisigContract,
    // nonce,
  });

  const callData = [];
  const txs = [];

  // Add the addresses, but keep the threshold the same
  for (let i = 0; i < agentInstances.length; i += 1) {
    const calldata = multisigContract.functions.addOwnerWithThreshold;

    console.log(calldata);
    // const abc = abiCoder.encode(
    //   multisigContract.functions.addOwnerWithThreshold.inputs,
    //   [agentInstances[i], threshold],
    // );

    // console.log(abc);
    // callData[i] = multisigContract.encodeFunctionData(
    //   'addOwnerWithThreshold',
    //   [agentInstances[i], threshold],
    // );
    // txs[i] = safeContracts.buildSafeTransaction({
    //   to: multisig,
    //   data: callData[i],
    //   nonce: 0,
    // });
  }

  // callData.push(
  //   multisigContract.interface.encodeFunctionData('removeOwner', [
  //     agentInstances[0],
  //     serviceOwner,
  //     threshold,
  //   ]),
  // );
  // txs.push(
  //   safeContracts.buildSafeTransaction({
  //     to: multisig,
  //     data: callData[callData.length - 1],
  //     nonce: 0,
  //   }),
  // );

  console.log({ safeContracts });

  const safeTx = safeContracts.buildMultiSendSafeTx(
    MULTI_SEND_CONTRACT.abi,
    txs,
  );

  console.log({ callData, txs, safeTx });

  // handleStep3Deploy(radioValue, data);
};
