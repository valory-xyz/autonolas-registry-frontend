import { useCallback } from 'react';
import { PublicKey, SystemProgram } from '@solana/web3.js';

import { useSvmConnectivity } from 'common-util/hooks/useSvmConnectivity';
import { useHelpers } from 'common-util/hooks';
import { sendTransaction } from 'common-util/functions';
import { notifySuccess, notifyError } from '@autonolas/frontend-library';
import { onActivateRegistration } from './utils';

export const useGetActivateRegistration = () => {
  const { isSvm, vmType } = useHelpers();
  const { solanaAddresses, walletPublicKey, program } = useSvmConnectivity();

  return useCallback(
    async (id, account, deposit) => {
      console.log('useGetActivateRegistration', id, account, deposit);

      const serviceRegistryPublicKeyInstance = new PublicKey(solanaAddresses.serviceRegistry);

      if (isSvm) {
        const fn = program.methods
          .activateRegistration(id)
          .accounts({
            dataAccount: solanaAddresses.storageAccount,
            systemProgram: SystemProgram.programId,
            // systemProgram: deposit,
            // systemProgram: SystemProgram.transfer({
            //   fromPubkey: walletPublicKey,
            //   toPubkey: solanaAddresses.serviceRegistry,
            //   lamports: deposit,
            // }),
          })
          .remainingAccounts([
            { pubkey: walletPublicKey, isSigner: true, isWritable: true },
            {
              pubkey: serviceRegistryPublicKeyInstance,
              isSigner: false,
              isWritable: true,
            },
          ])
          .signers([walletPublicKey]);

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

  // const abcd = async (id, account, deposit) => {
  //   console.log('useGetActivateRegistration', id, account, deposit);

  //   if (isSvm) {
  //     const response = await program.methods
  //       .activateRegistration(id)
  //       .accounts({ dataAccount: solanaAddresses.storageAccount })
  //       .remainingAccounts([
  //         { pubkey: walletPublicKey, isSigner: true, isWritable: true },
  //       ]);

  //     return response;
  //   }

  //   const response = await onActivateRegistration(id, account, deposit);
  //   return response;
  // };

  // return abcd;
  // return (...args) => console.log('useGetActivateRegistration', args);

  // return a function that returns a function
  // return () => {
  //   console.log('useGetActivateRegistration');
  //   return () => console.log('useGetActivateRegistration');
  // };
};
