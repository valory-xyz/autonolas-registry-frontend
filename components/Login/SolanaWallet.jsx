/* eslint-disable jest/require-hook */
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import {
  WalletModalProvider as ReactUIWalletModalProvider,
  // WalletConnectButton,
  // WalletDisconnectButton,
  // WalletModalButton,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import * as web3 from '@solana/web3.js';
import * as wallet from '@solana/wallet-adapter-wallets';
import { SolanaSignTransaction } from './SolanaSignTransaction';

require('@solana/wallet-adapter-react-ui/styles.css');

const wallets = [new wallet.PhantomWalletAdapter()];

const endpoint = web3.clusterApiUrl('devnet');

const SolanaWallet = () => (
  <ConnectionProvider endpoint={endpoint}>
    <WalletProvider wallets={wallets}>
      <ReactUIWalletModalProvider>
        <WalletMultiButton />
        &nbsp;
        <SolanaSignTransaction />
      </ReactUIWalletModalProvider>
    </WalletProvider>
  </ConnectionProvider>
);

export default SolanaWallet;
