/**
 * useSvmService.jsx
 * This file contains the hooks to fetch data from the SVM (Solana)
 */

import { useCallback } from 'react';
import { BorshCoder } from '@project-serum/anchor';
import {
  TransactionMessage,
  VersionedTransaction,
  PublicKey,
} from '@solana/web3.js';
import { areAddressesEqual } from '@autonolas/frontend-library';

import { SERVICE_STATE_KEY_MAP, TOTAL_VIEW_COUNT } from 'util/constants';
import idl from 'common-util/AbiAndAddresses/ServiceRegistrySolana.json';
import { useSvmConnectivity } from 'common-util/hooks/useSvmConnectivity';
import {
  transformDatasourceForServiceTable,
  transformSlotsAndBonds,
} from './helpers/functions';

/**
 * deseralize the program data
 * @param {Uint8Array} serializedValue serialized program data
 * @param {string | "publicKey" | "string"} decodeTypeName type name to decode, check
 * ServiceRegistrySolana.json for the type names
 *
 * @example
 * serializedValue = Uint8Array(32) [0, 0, ...]
 * @returns {object} deseralized program data
 * example: { name: "serviceOwner", type: "publicKey" },
 *
 */
const deseralizeProgramData = (serializedValue, decodeTypeName) => {
  if (decodeTypeName === 'string') {
    const value = serializedValue.toString();
    // NOTE: This is a hack to remove the extra bytes added by the program
    // not sure why this is happening, but this is a workaround
    const strippedValue = value.replace('m\u0000\u0000\u0000', '');
    return strippedValue;
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

// TODO: move to common-util
// hook to only READ data from the SVM (Solana)
export const useSvmDataFetch = () => {
  const {
    tempWalletPublicKey, connection, program, solanaAddresses,
  } = useSvmConnectivity();

  const getTransactionLogs = useCallback(
    async (fn, fnArgs) => {
      try {
        if (!fn) {
          throw new Error('function is not provided');
        }

        if (!tempWalletPublicKey || !program) return null;

        const latestBlock = await connection.getLatestBlockhash();

        // Build the instruction
        const instruction = await program.methods[fn](...(fnArgs || []))
          .accounts({ dataAccount: solanaAddresses.storageAccount })
          .instruction();

        // Build a versioned transaction with the instruction
        const txMessage = new TransactionMessage({
          payerKey: tempWalletPublicKey,
          recentBlockhash: latestBlock.blockhash,
          instructions: [instruction],
        }).compileToV0Message();

        // Create a versioned transaction
        const tx = new VersionedTransaction(txMessage);

        // Simulate the transaction.
        const transactionSimulation = await connection.simulateTransaction(tx, {
          commitment: 'confirmed',
        });

        // Log all the transaction logs.
        const transactionLogs = transactionSimulation.value.logs;
        return transactionLogs;
      } catch (error) {
        window.console.warn('Error getting transaction logs');
        console.error(error);
        throw error;
      }
    },
    [connection, program, tempWalletPublicKey, solanaAddresses],
  );

  /**
   * get data from the program
   * @param {string} fn function name
   * @param {array} fnArgs function arguments
   * @param {string} decodeTypeName type name to decode, check
   * ServiceRegistrySolana.json for the type names
   * @param {object} extraOptions extra options
   */
  const readSvmData = useCallback(
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

  return { readSvmData };
};

// *********** HOOKS TO FETCH SERVICES DATA ***********

// returns the total number of services
const useGetTotalForAllServices = () => {
  const { readSvmData } = useSvmDataFetch();

  const getTotalForAllSvmServices = useCallback(async () => {
    const total = await readSvmData('totalSupply', [], null, {
      noDecode: true,
    });
    return total;
  }, [readSvmData]);

  return { getTotalForAllSvmServices };
};

// returns the total number of services for the given account
// TODO: implement this after fetching the account balance
const useGetTotalForMyServices = () => {
  const { getTotalForAllSvmServices: getTotalForMySvmServices } = useGetTotalForAllServices();

  return { getTotalForMySvmServices };
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
const transformServiceData = (service, serviceId) => {
  if (!service) return {};
  const owner = service.serviceOwner?.toString();
  const stateName = Object.keys(service.state || {})[0];
  // convert to base58 ie. readable format
  const multisig = new PublicKey(service.multisig).toBase58();
  // convert configHash u32 to hex string
  const decodedConfigHash = Buffer.from(service.configHash, 'utf8').toString(
    'hex',
  );

  return {
    ...service,
    id: serviceId,
    owner,
    state: SERVICE_STATE_KEY_MAP[stateName],
    multisig,
    bonds: service.bonds.map((e) => Number(e)),
    configHash: decodedConfigHash,
  };
};

export const useGetSvmServiceDetails = () => {
  const { readSvmData } = useSvmDataFetch();

  const getSvmServiceDetails = useCallback(
    async (id) => {
      const details = await readSvmData('getService', [id], 'Service');
      return transformServiceData(details, id);
    },
    [readSvmData],
  );

  return { getSvmServiceDetails };
};

// returns the list of services
const useGetServices = () => {
  const { getSvmServiceDetails } = useGetSvmServiceDetails();

  const getSvmServices = useCallback(
    async (total, nextPage, fetchAll = false) => {
      const promises = [];
      const first = fetchAll ? 1 : (nextPage - 1) * TOTAL_VIEW_COUNT + 1;
      const last = fetchAll
        ? total
        : Math.min(nextPage * TOTAL_VIEW_COUNT, total);

      for (let i = first; i <= last; i += 1) {
        promises.push(getSvmServiceDetails(i));
      }

      const results = await Promise.all(promises);
      return results;
    },
    [getSvmServiceDetails],
  );

  return { getSvmServices };
};

// return the list of services for the given account
const useGetMyServices = () => {
  const { getSvmServiceDetails } = useGetSvmServiceDetails();

  const getMySvmServices = useCallback(
    async (account, total) => {
      const promises = [];

      // TODO: use the account balance to get the total
      // instead of passing the total as an argument.
      // It is work around for now.
      for (let i = 1; i <= total; i += 1) {
        promises.push(getSvmServiceDetails(i));
      }

      const results = await Promise.all(promises);
      const ownerServiceList = results.filter((e) => areAddressesEqual(e.owner, account));
      return ownerServiceList;
    },
    [getSvmServiceDetails],
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
  const { readSvmData } = useSvmDataFetch();

  const getSvmServiceOwner = useCallback(
    async (id) => {
      const owner = await readSvmData('ownerOf', [id], 'publicKey');
      return owner;
    },
    [readSvmData],
  );

  return { getSvmServiceOwner };
};

export const useTokenUri = () => {
  const { readSvmData } = useSvmDataFetch();

  const getSvmTokenUri = useCallback(
    async (id) => {
      const tokenUri = await readSvmData('tokenUri', [id], 'string');
      return tokenUri;
    },
    [readSvmData],
  );

  return { getSvmTokenUri };
};

// *********** HOOKS TO FETCH SERVICES STATE DATA ***********

export const useSvmBonds = () => {
  const { readSvmData } = useSvmDataFetch();

  const getSvmBonds = useCallback(
    async (id, tableDataSource) => {
      const response = await readSvmData(
        'getAgentParams',
        [id],
        'getAgentParams_returns',
      );

      const bondsArray = [];
      const slotsArray = [];
      for (let i = 0; i < response.numAgentIds; i += 1) {
        /**
         * agentParams = [{ slots: 2, bond: 2000 }, { slots: 3, bond: 4000 }]
         * slotsArray = [2, 3]
         * bondsArray = [2000, 4000]
         */

        slotsArray.push(response.slots[i]);
        bondsArray.push(response.bonds[i].toString()); // convert to string from BN
      }

      return transformSlotsAndBonds(slotsArray, bondsArray, tableDataSource);
    },
    [readSvmData],
  );

  return { getSvmBonds };
};

export const useSvmServiceTableDataSource = () => {
  const { readSvmData } = useSvmDataFetch();
  const { getSvmBonds } = useSvmBonds();

  const getSvmServiceTableDataSource = useCallback(
    async (id, agentIds) => {
      const { bonds, slots } = await getSvmBonds(id);

      const numAgentInstances = await Promise.all(
        agentIds.map(async (agentId) => {
          const info = await readSvmData(
            'getInstancesForAgentId',
            [id, agentId],
            'getInstancesForAgentId_returns',
          );
          return info.numAgentInstances;
        }),
      );

      const dataSource = transformDatasourceForServiceTable({
        agentIds,
        numAgentInstances,
        bonds,
        slots,
      });

      return dataSource;
    },
    [readSvmData, getSvmBonds],
  );

  return { getSvmServiceTableDataSource };
};

/* ----- step 4 functions ----- */
export const useAgentInstanceAndOperator = () => {
  const { readSvmData } = useSvmDataFetch();

  const getSvmAgentInstanceAndOperator = useCallback(
    async (id) => {
      const response = await readSvmData(
        'getAgentInstances',
        [id],
        'getAgentInstances_returns',
      );

      const data = await Promise.all(
        (response?.agentInstances || []).map(async (agentInstance, index) => {
          const operatorAddress = await readSvmData(
            'mapAgentInstanceOperators',
            [agentInstance],
            'publicKey',
          );
          return {
            id: `agent-instance-row-${index + 1}`,
            operatorAddress,
            agentInstance: agentInstance.toString(), // convert to string from BN
          };
        }),
      );

      return data;
    },
    [readSvmData],
  );

  return { getSvmAgentInstanceAndOperator };
};
