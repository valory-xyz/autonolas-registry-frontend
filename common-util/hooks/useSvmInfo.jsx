import {
  useAnchorWallet,
  useConnection,
  WalletContextState,
  AnchorWallet,
  useWallet as useAdapterWallet,
} from '@solana/wallet-adapter-react';
import { Program, AnchorProvider } from '@project-serum/anchor';

import { Connection, Keypair, PublicKey } from '@solana/web3.js';

import idl from 'common-util/AbiAndAddresses/ServiceRegistrySolana.json';
import {
  SVM_SERVICE_REGISTRY_PROGRAM_PUBLIC_KEY,
  SVM_STORAGE_ACCOUNT_PUBLIC_KEY,
} from 'common-util/Contracts/addresses';
import { useCallback, useMemo } from 'react';
import { VM_TYPE } from 'util/constants';
import { useHelpers } from '.';

const programId = new PublicKey(SVM_SERVICE_REGISTRY_PROGRAM_PUBLIC_KEY);

export const useSvmInfo = () => {
  const {  connection } = useConnection();
  const wallet = useAnchorWallet();
  const { vmType } = useHelpers();

  // const { } = useWallet();

  const serviceOwnerPublicKey = vmType === VM_TYPE.SVM ? null : wallet?.publicKey;

  const getProgramInstance = useCallback(() => {
    if (!wallet.publicKey) return null;

    const anchorProvider = new AnchorProvider(connection, wallet, {
      commitment: 'processed',
    });
    const program = new Program(idl, programId, anchorProvider);
    return program;
  }, [connection, wallet]);

  console.log({
    wallet,
    // anchorProvider,
    // program,
    // p: program.methods.totalSupply(),
    serviceOwnerPublicKey,
    // isWalletConnected: wallet.connected,
  });

  return {
    isProgramInstanceReady: !!wallet?.publicKey,
    getProgramInstance,
    // program,
    programId,
    serviceOwnerPublicKey,
    // isWalletConnected: wallet?.connected,
    storagePublicKey: new PublicKey(SVM_STORAGE_ACCOUNT_PUBLIC_KEY),
  };
};

// very important. We need this because our program needs to know how did we design our Anchor program
// which functions are there and how to use them

// Solana Explorer : https://explorer.solana.com

// we need the program id so that we can fetch the accounts/programs related to this account
const programID = new PublicKey(idl.metadata.address);

const opts = {
  preflightCommitment: 'processed',
};

// defining the return type of each variable.
// this will help us when we use these variables later
export const useWalletHook = () => {
  // we will use connection as a context to connect to solana blockchain
  // is it localhost, devnet, testnet or mainnet
  const { connection } = useConnection();

  // adapterwallet provides lots of information regaring who is connected to the wallet
  // the balance, public key etc

  // anchor wallet is an interface that will help us talk to the user's wallet
  const anchorWalletObj = useAnchorWallet();
  const dataAccount = Keypair.generate();

  // provider is required by the program, that will parse everyting for us from blockchain to normal data structure
  const provider = new AnchorProvider(connection, dataAccount, {});
  const program = new Program(idl, programID, provider);

  // we return everything from here, so that whoever calls this hook, gets all this data
  // then they can use it in whichever way they like.
  return {
    connection,
    anchorWalletObj,
    provider,
    program,
    dataAccount,
  };
};

export default useWalletHook;

// https://solana.stackexchange.com/questions/7017/how-to-use-anchors-view-in-frontend-without-prompting-wallet-to-sign
