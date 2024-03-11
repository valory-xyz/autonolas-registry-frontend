import { useMemo } from 'react';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider } from '@project-serum/anchor';
import { Keypair, PublicKey } from '@solana/web3.js';
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

  const actualWallet = useMemo(() => wallet?.publicKey || null, [wallet]);

  // program addresses
  const solanaAddresses = useMemo(
    () => (chainName === SOLANA_CHAIN_NAMES.MAINNET
      ? SOLANA_ADDRESSES
      : SOLANA_DEVNET_ADDRESSES),
    [chainName],
  );

  // provider for anchor, if wallet is not connected, use node wallet
  // (node wallet is used read-only operations, like fetching data from blockchain)
  const customProvider = useMemo(() => {
    if (!actualWallet) {
      const provider = new AnchorProvider(connection, NODE_WALLET, {
        commitment: 'processed',
      });
      setProvider(provider);
      return provider;
    }

    const currentWallet = window.solana ? wallet : Keypair.generate();
    return new AnchorProvider(connection, currentWallet, {
      commitment: 'processed',
    });
  }, [connection, wallet, actualWallet]);

  const programId = useMemo(
    () => new PublicKey(solanaAddresses.serviceRegistry),
    [solanaAddresses.serviceRegistry],
  );

  const program = useMemo(
    () => new Program(idl, programId, customProvider),
    [customProvider, programId],
  );

  const walletPublicKey = useMemo(
    () => actualWallet || TEMP_PUBLIC_KEY,
    [actualWallet],
  );

  return {
    walletPublicKey,
    /**
     * Public key of the wallet used for read-only operations
     */
    tempWalletPublicKey: TEMP_PUBLIC_KEY,
    connection,
    program,
    programId,
    solanaAddresses,
  };
};
