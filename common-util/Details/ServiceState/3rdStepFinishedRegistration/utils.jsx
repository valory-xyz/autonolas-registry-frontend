/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
import { ethers } from 'ethers';
import {
  GNOSIS_SAFE_CONTRACT,
  MULTI_SEND_CONTRACT,
} from 'common-util/AbiAndAddresses';
import {
  rpcUrl,
  getServiceOwnerMultisigContract,
  safeMultiSend,
} from 'common-util/Contracts';
import { pollTransactionDetails } from './test';

const safeContracts = require('@gnosis.pm/safe-contracts');

const ZEROS = '0000000000000000000000000000000000000000000000000000000000000000';

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
    window.MODAL_PROVIDER || window.web3.currentProvider,
    'any',
  );
  const code = await provider.getCode(account);

  try {
    // TODO: check if we are dealing with safe in future!
    // gnosis-safe
    if (code !== '0x') {
      // Create a message data from the multisend transaction
      const messageHash = await multisigContract.getTransactionHash(
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

      const multisigContractWeb3 = getServiceOwnerMultisigContract(multisig);

      // Get the signature bytes based on the account address, since it had its tx pre-approved
      const signatureBytes = `0x000000000000000000000000${account.slice(
        2,
      )}${ZEROS}01`;

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

      // Check if the hash was already approved
      await multisigContractWeb3.getPastEvents(
        'ApproveHash',
        {
          filter: { approvedHash: messageHash, owner: account },
          fromBlock: 0,
          toBlock: 'latest',
        },
        (_error, events) => {
          // if hash was already approved, call the deploy function right away.
          if (events.length > 0) {
            handleStep3Deploy(radioValue, packedData);
          } else {
            multisigContractWeb3.methods
              .approveHash(messageHash)
              .send({ from: account })
              .on('transactionHash', async (hash) => {
                // poll until has was approved, then call the deploy function
                await pollTransactionDetails(hash, chainId);
                handleStep3Deploy(radioValue, packedData);
              })
              .then((information) => window.console.log(information))
              .catch((e) => {
                console.error(e);
              });
          }
        },
      );
    } else {
      // metamask
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
    window.console.log('Error in signing:');
    console.error(error);
  }
};
