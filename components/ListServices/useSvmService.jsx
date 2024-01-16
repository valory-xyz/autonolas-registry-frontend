import { useCallback } from 'react';
import { BorshCoder } from '@project-serum/anchor';
import {
  TransactionMessage,
  VersionedTransaction,
  PublicKey,
} from '@solana/web3.js';
import { areAddressesEqual } from '@autonolas/frontend-library';

import { SERVICE_STATE_KEY_MAP } from 'util/constants';
import idl from 'common-util/AbiAndAddresses/ServiceRegistrySolana.json';
import { useSvmConnectivity } from 'common-util/hooks/useSvmConnectivity';

/**
 * deseralize the program data
 * @xample
 * serializedValue = Uint8Array(32) [0, 0, ...]
 * @returns {object} deseralized program data
 * example: { name: "serviceOwner", type: "publicKey" },
 *
 */
const deseralizeProgramData = (serializedValue, decodeTypeName) => {
  if (decodeTypeName === 'string') {
    return Buffer.from(serializedValue).toString();
  }

  if (decodeTypeName === 'publicKey') {
    const publicKey = new PublicKey(serializedValue);
    return publicKey.toBase58();
  }

  const borshCoder = new BorshCoder(idl);
  const decodedResult = borshCoder.types.decode(
    decodeTypeName,
    serializedValue,
  );
  return decodedResult;
};

const useSvmDataFetch = () => {
  const {
    walletPublicKey, connection, program, solanaAddresses,
  } = useSvmConnectivity();

  const getTransactionLogs = useCallback(
    async (fn, fnArgs) => {
      try {
        if (!fn) {
          throw new Error('function is not provided');
        }

        if (!walletPublicKey || !program) return null;

        const latestBlock = await connection.getLatestBlockhash();

        // Build the instruction
        const instruction = await program.methods[fn](...(fnArgs || []))
          .accounts({ dataAccount: solanaAddresses.storageAccount })
          .instruction();

        // Build a versioned transaction with the instruction
        const txMessage = new TransactionMessage({
          payerKey: walletPublicKey,
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
    [connection, program, walletPublicKey, solanaAddresses],
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

// returns the total number of services
const useGetTotalForAllServices = () => {
  const { getData } = useSvmDataFetch();

  const getTotalForAllSvmServices = useCallback(async () => {
    const total = await getData('totalSupply', [], null, { noDecode: true });
    return total;
  }, [getData]);

  return { getTotalForAllSvmServices };
};

// returns the total number of services for the given account
const useGetTotalForMyServices = () => {
  // TODO: implement this after fetching the account balance

  const { getTotalForAllSvmServices } = useGetTotalForAllServices();

  return { getTotalForMySvmServices: getTotalForAllSvmServices };
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
const transformServiceData = (e, index) => {
  const owner = e.serviceOwner?.toString();
  const stateName = Object.keys(e.state || {})[0];

  // TODO: transform more data for service details page
  return {
    ...e,
    id: index + 1,
    owner,
    state: SERVICE_STATE_KEY_MAP[stateName],
  };
};

export const useGetServiceDetails = () => {
  const { getData } = useSvmDataFetch();

  const getSvmServiceDetails = useCallback(
    async (id) => {
      const details = await getData('getService', [id], 'Service');
      return transformServiceData(details);
    },
    [getData],
  );

  return { getSvmServiceDetails };
};

// returns the list of services
const useGetServices = () => {
  const { getSvmServiceDetails } = useGetServiceDetails();

  const getSvmServices = useCallback(
    async (total) => {
      const promises = [];
      for (let i = 1; i <= total; i += 1) {
        promises.push(getSvmServiceDetails(i));
      }

      const results = (await Promise.all(promises)).map(transformServiceData);
      return results;
    },
    [getSvmServiceDetails],
  );

  return { getSvmServices };
};

// return the list of services for the given account
const useGetMyServices = () => {
  const { getData } = useSvmDataFetch();

  const getMySvmServices = useCallback(
    async (account, total) => {
      const promises = [];
      for (let i = 1; i <= total; i += 1) {
        promises.push(getData('getService', [i], 'Service'));
      }

      const results = (await Promise.all(promises)).map(transformServiceData);
      const ownerServiceList = results.filter((e) => areAddressesEqual(e.owner, account));
      return ownerServiceList;
    },
    [getData],
  );

  return { getMySvmServices };
};

export const useServiceInfo = () => {
  const { getTotalForAllSvmServices } = useGetTotalForAllServices();
  const { getTotalForMySvmServices } = useGetTotalForMyServices();
  const { getSvmServices } = useGetServices();
  const { getMySvmServices } = useGetMyServices();

  return {
    getTotalForAllSvmServices,
    getTotalForMySvmServices,
    getSvmServices,
    getMySvmServices,
  };
};

export const useServiceOwner = () => {
  const { getData } = useSvmDataFetch();

  const getSvmServiceOwner = useCallback(
    async (id) => {
      const owner = await getData('ownerOf', [id], 'publicKey');
      return owner;
    },
    [getData],
  );

  return { getSvmServiceOwner };
};

export const useTokenUri = () => {
  const { getData } = useSvmDataFetch();

  const getSvmTokenUri = useCallback(
    async (id) => {
      const tokenUri = await getData('tokenURI', [id], 'string');
      return tokenUri;
    },
    [getData],
  );

  return { getSvmTokenUri };
};
