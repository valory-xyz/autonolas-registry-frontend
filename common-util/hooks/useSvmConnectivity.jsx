import { useMemo } from 'react';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider } from '@project-serum/anchor';
import { Keypair, PublicKey } from '@solana/web3.js';

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
  const wallet = useAnchorWallet();

  const { chainName, isSvm } = useHelpers();

  const solanaAddresses = useMemo(
    () => (chainName === SOLANA_CHAIN_NAMES.MAINNET
      ? SOLANA_ADDRESSES
      : SOLANA_DEVNET_ADDRESSES),
    [chainName],
  );

  const anchorProvider = useMemo(
    () => {
      const currentWallet = window.solana ? wallet : Keypair.generate();

      return new AnchorProvider(connection, currentWallet, {
        commitment: 'processed',
      });
    },
    [connection, wallet],
  );

  const programId = useMemo(
    () => new PublicKey(solanaAddresses.serviceRegistry),
    [solanaAddresses.serviceRegistry],
  );

  const program = useMemo(
    () => new Program(idl, programId, anchorProvider),
    [anchorProvider, programId],
  );

  return {
    walletPublicKey: wallet?.publicKey,
    connection,
    program,
    programId,
    solanaAddresses,
    hasNoSvmPublicKey: isSvm ? !wallet?.publicKey : false,
  };
};
