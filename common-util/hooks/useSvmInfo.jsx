import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';

import idl from 'common-util/AbiAndAddresses/ServiceRegistrySolana.json';
import { SOLANA_ADDRESSES, SOLANA_DEVNET_ADDRESSES } from 'common-util/Contracts/addresses';
import { useHelpers } from '.';

export const useSvmInfo = () => {
  const { connection } = useConnection();
  const wallet = useWallet();

  const { chainName } = useHelpers();

  const getAddresses = () => {
    if (chainName === 'solana') {
      return SOLANA_ADDRESSES;
    }
    return SOLANA_DEVNET_ADDRESSES;
  };

  const addresses = getAddresses();

  const programId = new PublicKey(addresses.serviceRegistry);

  const anchorProvider = new AnchorProvider(connection, wallet, {
    commitment: 'processed',
  });

  const program = new Program(idl, programId, anchorProvider);

  return {
    wallet,
    program,
    getAddresses,
  };
};
