import {
  BN, Program, AnchorProvider,
} from '@project-serum/anchor';
import { Button } from 'antd';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import React from 'react';
import { notifyError, notifySuccess } from '@autonolas/frontend-library';
import { PublicKey } from '@solana/web3.js';

import idl from 'common-util/AbiAndAddresses/ServiceRegistrySolana.json';

const STORAGE_ACCOUNT_PUBLIC_KEY = '2afUAb8aRfcUentfGone5L2J5DeKz9PsSj4zs1WZREUf';
const SERVICE_REGISTRY_PROGRAM_PUBLIC_KEY = 'AU428Z7KbjRMjhmqWmQwUta2AvydbpfEZNBh8dStHTDi';

const programId = new PublicKey(SERVICE_REGISTRY_PROGRAM_PUBLIC_KEY);

export const SolanaSignTransaction = () => {
  const [loading, setLoading] = React.useState(false);

  const { connection } = useConnection();
  const wallet = useWallet();

  const serviceOwnerPublicKey = wallet.publicKey;

  const anchorProvider = new AnchorProvider(connection, wallet, {
    commitment: 'processed',
  });

  const onClick = async () => {
    try {
      setLoading(true);

      if (!wallet.publicKey) throw new Error('Wallet not connected!');

      const program = new Program(idl, programId, anchorProvider);

      // Define the parameters for the new service
      const configHash = Buffer.from('5'.repeat(64), 'hex');
      const regBond = new BN(1000);
      const agentIds = [1, 2];
      const slots = [2, 3];
      const bonds = [regBond, regBond];
      const maxThreshold = slots[0] + slots[1];

      // Create a service
      // eslint-disable-next-line max-len
      const response = await program.methods.create(serviceOwnerPublicKey, configHash, agentIds, slots, bonds, maxThreshold)
        .accounts({ dataAccount: STORAGE_ACCOUNT_PUBLIC_KEY })
        .remainingAccounts([
          { pubkey: serviceOwnerPublicKey, isSigner: true, isWritable: true },
        ])
        .rpc();

      notifySuccess(`Service created: ${response}`, <a href={`https://explorer.solana.com/tx/${response}?cluster=devnet`} target="_blank" rel="noopener noreferrer">view transaction</a>);
    } catch (error) {
      notifyError(error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button loading={loading} onClick={onClick} disabled={!wallet.publicKey}>
      Sign Transaction
    </Button>
  );
};
