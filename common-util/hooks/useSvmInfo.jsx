import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';

import idl from 'common-util/AbiAndAddresses/ServiceRegistrySolana.json';
import { SOLANA_ADDRESSES, SOLANA_DEVNET_ADDRESSES } from 'common-util/Contracts/addresses';
import { SOLANA_CHAIN_NAMES } from 'util/constants';
import { useHelpers } from '.';

export const useSvmInfo = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const { chainName } = useHelpers();

  const solanaAddresses = (chainName === SOLANA_CHAIN_NAMES.SOLANA)
    ? SOLANA_ADDRESSES : SOLANA_DEVNET_ADDRESSES;

  const programId = new PublicKey(solanaAddresses.serviceRegistry);

  const anchorProvider = new AnchorProvider(connection, wallet, {
    commitment: 'processed',
  });

  const program = new Program(idl, programId, anchorProvider);

  return {
    wallet,
    program,
    solanaAddresses,
  };
};
