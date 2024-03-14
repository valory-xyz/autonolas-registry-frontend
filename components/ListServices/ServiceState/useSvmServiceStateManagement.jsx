import { useCallback } from 'react';
import { PublicKey } from '@solana/web3.js';
import { notifyError } from '@autonolas/frontend-library';

import { SVM_EMPTY_ADDRESS } from 'util/constants';
import { useSvmConnectivity } from 'common-util/hooks/useSvmConnectivity';
import { useHelpers } from 'common-util/hooks';
import { sendTransaction } from 'common-util/functions';
import {
  onActivateRegistration,
  checkIfAgentInstancesAreValid as checkIfAgentInstancesAreValidEvm,
  onStep2RegisterAgents,
  onTerminate,
  onStep5Unbond,
} from './utils';
import { useSvmDataFetch } from '../useSvmService';

/**
 * step 1 - activate registration
 */
export const useGetActivateRegistration = () => {
  const { isSvm, vmType } = useHelpers();
  const { solanaAddresses, walletPublicKey, program } = useSvmConnectivity();

  return useCallback(
    async (id, account, deposit) => {
      if (isSvm) {
        const pdaEscrow = new PublicKey(solanaAddresses.pda);

        const fn = program.methods
          .activateRegistration(id)
          .accounts({ dataAccount: solanaAddresses.storageAccount })
          .remainingAccounts([
            { pubkey: walletPublicKey, isSigner: true, isWritable: true },
            { pubkey: pdaEscrow, isSigner: false, isWritable: true },
          ]);

        const response = await sendTransaction(fn, account || undefined, {
          vmType,
          registryAddress: solanaAddresses.serviceRegistry,
        });

        return response;
      }

      const response = await onActivateRegistration(id, account, deposit);
      return response;
    },
    [isSvm, solanaAddresses, walletPublicKey, program, vmType],
  );
};

/**
 * step 2 - register agents
 */
export const useRegisterAgents = () => {
  const { isSvm, vmType } = useHelpers();
  const { solanaAddresses, walletPublicKey, program } = useSvmConnectivity();
  const { readSvmData } = useSvmDataFetch();

  // check the logic for below method in utils.jsx => checkIfAgentInstancesAreValid
  // and should be same for both EVM and SVM
  const checkIfAgentInstancesAreValid = useCallback(
    async ({ account, agentInstances }) => {
      if (isSvm) {
        const operator = await readSvmData(
          'mapAgentInstanceOperators',
          [walletPublicKey],
          'publicKey',
        );

        if (operator !== SVM_EMPTY_ADDRESS) {
          notifyError(
            'The operator is registered as an agent instance already.',
          );
          return false;
        }

        const agentInstanceAddressesPromises = agentInstances.map(
          async (agentInstance) => {
            const eachAgentInstance = await readSvmData(
              'mapAgentInstanceOperators',
              [new PublicKey(agentInstance)],
              'publicKey',
            );
            return eachAgentInstance;
          },
        );

        const agentInstanceAddresses = await Promise.all(
          agentInstanceAddressesPromises,
        );
        const ifValidArray = agentInstanceAddresses.some(
          (eachAgentInstance) => eachAgentInstance === SVM_EMPTY_ADDRESS,
        );

        if (!ifValidArray) {
          notifyError('The agent instance address is already registered.');
          return false;
        }

        return true;
      }

      const response = await checkIfAgentInstancesAreValidEvm({
        account,
        agentInstances,
      });
      return response;
    },
    [isSvm, walletPublicKey, readSvmData],
  );

  const registerAgents = useCallback(
    async ({
      account, serviceId, agentIds, agentInstances, dataSource,
    }) => {
      if (isSvm) {
        const pdaEscrow = new PublicKey(solanaAddresses.pda);

        const instancesPublicKey = agentInstances.map(
          (agentInstance) => new PublicKey(agentInstance),
        );
        const agentIdsInString = agentIds.map((agentId) => `${agentId}`);

        const fn = program.methods
          .registerAgents(serviceId, instancesPublicKey, agentIdsInString)
          .accounts({ dataAccount: solanaAddresses.storageAccount })
          .remainingAccounts([
            { pubkey: walletPublicKey, isSigner: true, isWritable: true },
            { pubkey: pdaEscrow, isSigner: false, isWritable: true },
          ]);

        const response = await sendTransaction(fn, account || undefined, {
          vmType,
          registryAddress: solanaAddresses.serviceRegistry,
        });

        return response;
      }

      const response = await onStep2RegisterAgents({
        account,
        serviceId,
        agentIds,
        agentInstances,
        dataSource,
      });
      return response;
    },
    [isSvm, solanaAddresses, walletPublicKey, program, vmType],
  );

  return { checkIfAgentInstancesAreValid, registerAgents };
};

/**
 * step 3 - deploy
 */
export const useFinishRegistration = () => {
  const { vmType, account } = useHelpers();
  const { solanaAddresses, walletPublicKey, program } = useSvmConnectivity();

  return useCallback(
    async (id, multisigKey) => {
      const fn = program.methods
        .deploy(id, new PublicKey(multisigKey))
        .accounts({ dataAccount: solanaAddresses.storageAccount })
        .remainingAccounts([
          { pubkey: walletPublicKey, isSigner: true, isWritable: true },
        ]);

      const response = await sendTransaction(fn, account || undefined, {
        vmType,
        registryAddress: solanaAddresses.serviceRegistry,
      });

      return response;
    },
    [solanaAddresses, walletPublicKey, program, vmType, account],
  );
};

/**
 * step 5 - unbond
 */
export const useUnbond = () => {
  const { vmType, isSvm, account } = useHelpers();
  const { solanaAddresses, walletPublicKey, program } = useSvmConnectivity();

  return useCallback(
    async (id) => {
      if (isSvm) {
        const pdaEscrow = new PublicKey(solanaAddresses.pda);

        const fn = program.methods
          .unbond(id)
          .accounts({ dataAccount: solanaAddresses.storageAccount })
          .remainingAccounts([
            { pubkey: walletPublicKey, isSigner: true, isWritable: true },
            { pubkey: pdaEscrow, isSigner: false, isWritable: true },
          ]);

        const response = await sendTransaction(fn, account || undefined, {
          vmType,
          registryAddress: solanaAddresses.serviceRegistry,
        });

        return response;
      }

      const response = await onStep5Unbond(account, id);
      return response;
    },
    [solanaAddresses, walletPublicKey, program, vmType, isSvm, account],
  );
};

/**
 * hook to terminate service in all steps
 */
export const useTerminate = () => {
  const { isSvm, vmType } = useHelpers();
  const { solanaAddresses, program, walletPublicKey } = useSvmConnectivity();

  return useCallback(
    async (account, serviceId) => {
      if (isSvm) {
        const pdaEscrow = new PublicKey(solanaAddresses.pda);

        const fn = program.methods
          .terminate(serviceId)
          .accounts({ dataAccount: solanaAddresses.storageAccount })
          .remainingAccounts([
            { pubkey: walletPublicKey, isSigner: true, isWritable: true },
            { pubkey: pdaEscrow, isSigner: false, isWritable: true },
          ]);

        const response = await sendTransaction(fn, account || undefined, {
          vmType,
          registryAddress: solanaAddresses.serviceRegistry,
        });

        return response;
      }

      const response = await onTerminate(account, serviceId);
      return response;
    },
    [isSvm, solanaAddresses, program, walletPublicKey, vmType],
  );
};
