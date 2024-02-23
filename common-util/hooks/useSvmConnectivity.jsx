import { useMemo } from 'react';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider } from '@project-serum/anchor';
import { Keypair } from '@solana/web3.js';
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet';
import { web3, setProvider } from '@coral-xyz/anchor';

import { SOLANA_CHAIN_NAMES } from 'util/constants';
import idl from 'common-util/AbiAndAddresses/ServiceRegistrySolana.json';
import {
  SOLANA_ADDRESSES,
  SOLANA_DEVNET_ADDRESSES,
} from 'common-util/Contracts/addresses';
import { useHelpers } from './index';

const NODE_WALLET = new NodeWallet(Keypair.generate());
const TEMP_PUBLIC_KEY = new web3.PublicKey(
  process.env.NEXT_PUBLIC_SVM_PUBLIC_KEY,
);

/**
 * hook to get svm info
 */
export const useSvmConnectivity = () => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const { chainName } = useHelpers();

  const solanaAddresses = useMemo(
    () => (chainName === SOLANA_CHAIN_NAMES.MAINNET
      ? SOLANA_ADDRESSES
      : SOLANA_DEVNET_ADDRESSES),
    [chainName],
  );

  const customProvider = useMemo(() => {
    const isNodeProvider = true;

    if (isNodeProvider) {
      return new AnchorProvider(connection, NODE_WALLET, {
        commitment: 'processed',
      });
    }

    const currentWallet = window.solana ? wallet : Keypair.generate();
    return new AnchorProvider(connection, currentWallet, {
      commitment: 'processed',
    });
  }, [connection, wallet]);

  setProvider(customProvider);

  const programId = useMemo(
    () => new web3.PublicKey(solanaAddresses.serviceRegistry),
    [solanaAddresses.serviceRegistry],
  );

  const program = useMemo(
    () => new Program(idl, programId, customProvider),
    [customProvider, programId],
  );

  const walletPublicKey = useMemo(
    () => wallet?.publicKey || TEMP_PUBLIC_KEY,
    [wallet],
  );

  return {
    walletPublicKey,
    connection,
    program,
    programId,
    solanaAddresses,
  };
};
