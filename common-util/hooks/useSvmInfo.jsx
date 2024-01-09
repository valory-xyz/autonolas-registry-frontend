import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';

import idl from 'common-util/AbiAndAddresses/ServiceRegistrySolana.json';
import { SVM_SERVICE_REGISTRY_PROGRAM_PUBLIC_KEY } from 'common-util/Contracts/addresses';

const programId = new PublicKey(SVM_SERVICE_REGISTRY_PROGRAM_PUBLIC_KEY);

export const useSvmInfo = () => {
  const { connection } = useConnection();
  const wallet = useWallet();

  const anchorProvider = new AnchorProvider(connection, wallet, {
    commitment: 'processed',
  });

  const program = new Program(idl, programId, anchorProvider);

  return {
    program,
  };
};
