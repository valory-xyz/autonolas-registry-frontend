import { useMemo } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';

import { SOLANA_CHAIN_NAMES } from 'util/constants';
import idl from 'common-util/AbiAndAddresses/ServiceRegistrySolana.json';
import {
  SOLANA_ADDRESSES,
  SOLANA_DEVNET_ADDRESSES,
} from 'common-util/Contracts/addresses';
import { useHelpers } from './index';

/**
 * hook to get svm info
 */
export const useSvmConnectivity = () => {
  const { connection } = useConnection();
  const { publicKey, wallet } = useWallet();

  const { chainName } = useHelpers();

  const solanaAddresses = useMemo(
    () => (chainName === SOLANA_CHAIN_NAMES.MAINNET
      ? SOLANA_ADDRESSES
      : SOLANA_DEVNET_ADDRESSES),
    [chainName],
  );

  const anchorProvider = new AnchorProvider(connection, wallet, {
    commitment: 'processed',
  });

  const programId = new PublicKey(solanaAddresses.serviceRegistry);
  const program = new Program(idl, programId, anchorProvider);

  return {
    publicKey,
    wallet,
    connection,
    program,
    solanaAddresses,
  };
};
