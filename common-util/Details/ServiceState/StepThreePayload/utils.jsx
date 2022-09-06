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

  console.log({ iface, abc: iface.encodeFunctionData, nonce });

  const callData = [];
  const txs = [];

  // Add the addresses, but keep the threshold the same
  for (let i = 0; i < agentInstances.length; i += 1) {
    callData[i] = multisigContract.interface.encodeFunctionData(
      'addOwnerWithThreshold',
      [agentInstances[i], threshold],
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

  // handleStep3Deploy(radioValue, data);
};
