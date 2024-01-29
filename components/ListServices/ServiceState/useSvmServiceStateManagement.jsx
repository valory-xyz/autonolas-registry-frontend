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

      if (isSvm) {
        const [pda] = await PublicKey.findProgramAddress(
          [Buffer.from('pdaEscrow', 'utf-8')],
          solanaAddresses.serviceRegistry,
          // program.programId,
        );

        const pdaEscrow = pda;

        const fn = await program.methods
          .activateRegistration(id)
          .accounts({
            dataAccount: solanaAddresses.storageAccount,
          })
          .remainingAccounts([
            { pubkey: walletPublicKey, isSigner: true, isWritable: true },
            {
              pubkey: pdaEscrow,
              isSigner: false,
              isWritable: true,
            },
          ])
          .signers([wallet])
          .rpc();

        console.log('fn', fn);

        // const response = await sendTransaction(fn, account || undefined, {
        //   vmType,
        //   registryAddress: solanaAddresses.serviceRegistry,
        // });

        // return response;

        return null;
      }

      const response = await onActivateRegistration(id, account, deposit);
      return response;
    },
    [isSvm, solanaAddresses, walletPublicKey, program, vmType],
  );
};

// const [pda] = await PublicKey.findProgramAddress(
//   [Buffer.from('pdaEscrow', 'utf-8')],
//   program.programId,
// );

// const pdaEscrow = pda;

// const fn = program.methods
//   .activateRegistration(id)
//   .accounts({
//     dataAccount: solanaAddresses.storageAccount,
//   })
//   .remainingAccounts([
//     { pubkey: walletPublicKey, isSigner: true, isWritable: true },
//     {
//       pubkey: pdaEscrow,
//       isSigner: false,
//       isWritable: true,
//     },
//   ])
//   .signers([wallet]);
