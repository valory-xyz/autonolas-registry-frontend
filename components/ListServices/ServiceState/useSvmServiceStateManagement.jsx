import { useCallback } from 'react';
import { PublicKey, SystemProgram } from '@solana/web3.js';

import { useSvmConnectivity } from 'common-util/hooks/useSvmConnectivity';
import { useHelpers } from 'common-util/hooks';
import { sendTransaction } from 'common-util/functions';
import { notifySuccess, notifyError } from '@autonolas/frontend-library';
import { onActivateRegistration } from './utils';

export const useGetActivateRegistration = () => {
  const { isSvm, vmType } = useHelpers();
  const {
    solanaAddresses, walletPublicKey, program, wallet,
  } = useSvmConnectivity();

  return useCallback(
    async (id, account, deposit) => {
      console.log('useGetActivateRegistration', id, account, deposit);

      const [pda] = await PublicKey.findProgramAddress(
        [Buffer.from('pdaEscrow', 'utf-8')],
        program.programId,
      );

      const pdaEscrow = pda;
      // const pdaEscrow = pda.toBase58();
      console.log('pda', pda);

      const serviceRegistryPublicKeyInstance = new PublicKey(
        solanaAddresses.serviceRegistry,
      );
      // const pdaEscrow = await PublicKey.findProgramAddressSync(
      //   [
      //     Buffer.from('escrow'),
      //     serviceRegistryPublicKeyInstance.toBuffer(),
      //     new PublicKey(id).toBuffer(),
      //   ],
      //   serviceRegistryPublicKeyInstance,
      // );

      if (isSvm) {
        const fn = program.methods
          .activateRegistration(id)
          .accounts({
            dataAccount: solanaAddresses.storageAccount,
            // systemProgram: SystemProgram.programId,
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
              pubkey: pdaEscrow,
              isSigner: false,
              isWritable: true,
            },
          ])
          .signers([wallet]);

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
