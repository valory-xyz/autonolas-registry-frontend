/* eslint-disable no-underscore-dangle */
import { ethers } from 'ethers';
import {
  GNOSIS_SAFE_CONTRACT,
  MULTI_SEND_CONTRACT,
} from 'common-util/AbiAndAddresses';
import {
  rpc,
  getServiceOwnerMultisigContract,
  safeMultiSend,
  getMyProvider,
} from 'common-util/Contracts';
import { checkIfGnosisSafe } from 'common-util/functions';
import { isHashApproved } from './helpers';

const safeContracts = require('@gnosis.pm/safe-contracts');

const ZEROS_24 = '0'.repeat(24);
const ZEROS_64 = '0'.repeat(64);

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
    ethers.getDefaultProvider(rpc[chainId]),
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
    ethers.getDefaultProvider(rpc[chainId]),
  );

  const safeTx = safeContracts.buildMultiSendSafeTx(
    multiSendContract,
    txs,
    nonce,
  );

  const provider = new ethers.providers.Web3Provider(getMyProvider(), 'any');
  const isSafe = await checkIfGnosisSafe(account, provider);

  try {
    // TODO: check if we are dealing with safe in future!
    // logic to deal with gnosis-safe
    if (isSafe) {
      // Create a message hash from the multisend transaction
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

      const multisigContractServiceOwner = getServiceOwnerMultisigContract(multisig);
      const startingBlock = await provider.getBlockNumber();

      // Get the signature bytes based on the account address, since it had its tx pre-approved
      const signatureBytes = `0x${ZEROS_24}${account.slice(2)}${ZEROS_64}01`;

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
      const filterOption = { approvedHash: messageHash, owner: account };
      await multisigContractServiceOwner.getPastEvents(
        'ApproveHash',
        {
          filter: filterOption,
          fromBlock: 0,
          toBlock: 'latest',
        },
        (_error, events) => {
          // if hash was already approved, call the deploy function right away.
          if (events.length > 0) {
            handleStep3Deploy(radioValue, packedData);
          } else {
            // else wait until the hash is approved and then call deploy function
            multisigContractServiceOwner
              .approveHash(messageHash)
              .send({ from: account })
              .on('transactionHash', async (hash) => {
                window.console.log('safeTx', hash);

                // TODO: use websocket based subscription to fetch real-time event
                // await until the hash is approved & then deploy
                await isHashApproved(
                  multisigContractServiceOwner,
                  startingBlock,
                  filterOption,
                );
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
      // logic to deal with metamask
      const signer = provider.getSigner();

      const getSignatureBytes = async () => {
        // Get the signature of a multisend transaction
        const signatureBytes = await signer._signTypedData(
          { verifyingContract: multisig, chainId },
          EIP712_SAFE_TX_TYPE,
          safeTx,
        );

        // take last 2 characters
        const last2Char = signatureBytes.slice(-2);

        // check if the last2Char is less than 2
        const value = parseInt(last2Char, 16);

        // if less than 2, add chainId * 2 + 35
        if (value < 2) {
          // correct value updated by the ledger
          const newValue = value + 27;

          // convert to hex (eg. 37 -> 25, 38 -> 26)
          const updatedLast2Char = newValue.toString(16);

          // update the last 2 char
          const updatedSignatureBytes = signatureBytes.slice(0, -2) + updatedLast2Char;
          return updatedSignatureBytes;
        }

        return signatureBytes;
      };

      const signatureBytes = await getSignatureBytes();

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
