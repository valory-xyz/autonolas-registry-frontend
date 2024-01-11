import { useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, BorshCoder } from '@project-serum/anchor';
import {
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';

import { SERVICE_STATE_KEY_MAP } from 'util/constants';
import idl from 'common-util/AbiAndAddresses/ServiceRegistrySolana.json';
import {
  SVM_SERVICE_REGISTRY_PROGRAM_PUBLIC_KEY,
  SVM_STORAGE_ACCOUNT_PUBLIC_KEY,
} from 'common-util/Contracts/addresses';

const programId = new PublicKey(SVM_SERVICE_REGISTRY_PROGRAM_PUBLIC_KEY);

/**
 * deseralize the program data
 * @xample
 * serializedValue = Uint8Array(32) [0, 0, ...]
 * @returns {object} deseralized program data
 * example: { name: "serviceOwner", type: "publicKey" },
 *
 */
const deseralizeProgramData = (serializedValue, decodeTypeName) => {
  const borshCoder = new BorshCoder(idl);
  const decodedResult = borshCoder.types.decode(
    decodeTypeName,
    serializedValue,
  );
  return decodedResult;
};

/**
 * hook to get svm info
 * @returns {object} publicKey, connection, program
 */
const useSvmInfo = () => {
  const { connection } = useConnection();
  const { publicKey, wallet } = useWallet();

  const anchorProvider = new AnchorProvider(connection, wallet, {
    commitment: 'processed',
  });

  const program = new Program(idl, programId, anchorProvider);

  return { publicKey, connection, program };
};

const useSvmData = () => {
  const { publicKey, connection, program } = useSvmInfo();

  const getTransactionLogs = useCallback(
    async (fn, fnArgs) => {
      try {
        if (!fn) {
          throw new Error('function name is required');
        }

        if (!publicKey || !program) return null;

        const latestBlock = await connection.getLatestBlockhash();

        // Build the instruction
        const instruction = await program.methods[fn](...(fnArgs || []))
          .accounts({ dataAccount: SVM_STORAGE_ACCOUNT_PUBLIC_KEY })
          .instruction();

        // Build a versioned transaction with the instruction
        const txMessage = new TransactionMessage({
          payerKey: publicKey,
          recentBlockhash: latestBlock.blockhash,
          instructions: [instruction],
        }).compileToV0Message();
        const tx = new VersionedTransaction(txMessage);

        // Simulate the transaction.
        const transactionSimulation = await connection.simulateTransaction(tx);

        // Log all the transaction logs.
        const transactionLogs = transactionSimulation.value.logs;

        return transactionLogs;
      } catch (error) {
        window.console.warn('Error getting transaction logs');
        throw error;
      }
    },
    [connection, program, publicKey],
  );

  /**
   * get data from the program
   * @param {string} fn function name
   * @param {array} fnArgs function arguments
   * @param {string} decodeTypeName type name to decode, check
   * ServiceRegistrySolana.json for the type names
   * @param {object} extraOptions extra options
   */
  const getData = useCallback(
    async (fn, fnArgs, decodeTypeName = null, extraOptions = {}) => {
      const { noDecode = false } = extraOptions;

      const transactionLogs = await getTransactionLogs(fn, fnArgs);

      // NOTE: If value is "0", then returnData returns null, so can't use this for bool
      // As workaround to avoid null return data when value is "0"
      // Extract the program return data directly from the logs.
      // Find log entry that starts with "Program return:"
      const returnPrefix = `Program return: ${program.programId} `;
      const returnLogEntry = transactionLogs?.find((log) => log.startsWith(returnPrefix));

      // If no return log entry, then return null
      if (!returnLogEntry) return null;

      // Slice out the prefix to get the base64 return data
      // and Convert the Base64 return data
      const encodedReturnData = returnLogEntry.slice(returnPrefix.length);
      const decodedBuffer = Buffer.from(encodedReturnData, 'base64');

      // If noDecode is true, then return the decoded buffer's first byte
      if (noDecode) {
        return decodedBuffer[0];
      }

      // Deserialize the return data
      const finalResult = deseralizeProgramData(decodedBuffer, decodeTypeName);
      return finalResult;
    },
    [getTransactionLogs, program],
  );

  return { getData };
};

// *********** HOOKS TO FETCH SERVICES DATA ***********

export const useGetTotalForAllServices = () => {
  const { getData } = useSvmData();

  const getTotalForAllSvmServices = useCallback(async () => {
    const total = await getData('totalSupply', [], null, { noDecode: true });
    return total;
  }, [getData]);

  return { getTotalForAllSvmServices };
};

/**
 * @typedef Service
 * @type {Object}
 * @property {string} owner - The owner of the service
 * @property {string} state - The state of the service (eg. 4)
 */

/**
 * Transform service data
 * @param {Service}
 *
 */
const transformServiceData = (e) => {
  const owner = e.serviceOwner?.toString();
  const stateName = Object.keys(e.state || {})[0];

  // TODO: transform more data once start with service
  //  details page
  return {
    ...e,
    owner,
    state: SERVICE_STATE_KEY_MAP[stateName],
  };
};

export const useGetServices = () => {
  const { getData } = useSvmData();

  const getServices = useCallback(
    async (total) => {
      const promises = [];
      for (let i = 1; i <= total; i += 1) {
        promises.push(getData('getService', [i], 'Service'));
      }

      const results = (await Promise.all(promises)).map(transformServiceData);
      return results;
    },
    [getData],
  );

  return { getServices };
};
