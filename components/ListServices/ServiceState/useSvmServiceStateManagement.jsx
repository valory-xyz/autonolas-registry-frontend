import { useCallback } from 'react';
import { PublicKey } from '@solana/web3.js';

import { useSvmConnectivity } from 'common-util/hooks/useSvmConnectivity';
import { useHelpers } from 'common-util/hooks';
import { sendTransaction } from 'common-util/functions';
import {
  onActivateRegistration,
  checkIfAgentInstancesAreValid as checkIfAgentInstancesAreValidEvm,
  onStep2RegisterAgents,
  onTerminate,
  // onStep3Deploy,
} from './utils';
// import { useSvmDataFetch } from '../useSvmService';

// TODO: fix all the .rpc and use sendTransaction instead

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

export const useRegisterAgents = () => {
  const {
    isSvm,
    // vmType
  } = useHelpers();
  const { solanaAddresses, walletPublicKey, program } = useSvmConnectivity();
  // const { getData } = useSvmDataFetch();

  const checkIfAgentInstancesAreValid = useCallback(
    async ({ account, agentInstances }) => {
      if (isSvm) {
        // const fn = await program.methods
        //   .mapAgentInstanceOperators(walletPublicKey)
        //   .accounts({ dataAccount: solanaAddresses.storageAccount })
        //   .remainingAccounts([
        //     { pubkey: walletPublicKey, isSigner: true, isWritable: true },
        //   ]);

        // const operator = await sendTransaction(fn, account || undefined, {
        //   vmType,
        //   registryAddress: solanaAddresses.serviceRegistry,
        // });

        // TODO: do we need to check the operator is registered as an agent instance already for SVM
        // const operator = await getData(
        //   'mapAgentInstanceOperators',
        //   [walletPublicKey],
        //   'publicKey',
        // );

        // console.log(operator);
        // return response;

        return true;
      }

      const response = await checkIfAgentInstancesAreValidEvm({
        account,
        agentInstances,
      });
      return response;
    },
    [
      isSvm,
      //  solanaAddresses, walletPublicKey, program, vmType
    ],
  );

  const registerAgents = useCallback(
    async ({
      account, serviceId, agentIds, agentInstances, dataSource,
    }) => {
      if (isSvm) {
        const pdaEscrow = new PublicKey(solanaAddresses.pda);

        const agIns = agentInstances.map(
          (agentInstance) => new PublicKey(agentInstance),
        );
        const agIds = agentIds.map((agentId) => `${agentId}`);
        // console.log({ serviceId, agIns, agIds });

        const fn = await program.methods
          .registerAgents(serviceId, agIns, agIds)
          .accounts({ dataAccount: solanaAddresses.storageAccount })
          .remainingAccounts([
            { pubkey: walletPublicKey, isSigner: true, isWritable: true },
            { pubkey: pdaEscrow, isSigner: false, isWritable: true },
          ])
          .rpc();

        // const response = await sendTransaction(fn, account || undefined, {
        //   vmType,
        //   registryAddress: solanaAddresses.serviceRegistry,
        // });

        // return response;
        return fn;
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
    [
      isSvm,
      solanaAddresses,
      walletPublicKey,
      program,
      // vmType
    ],
  );

  return {
    checkIfAgentInstancesAreValid,
    registerAgents,
  };
};

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
