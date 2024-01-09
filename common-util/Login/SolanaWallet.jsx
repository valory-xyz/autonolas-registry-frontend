/* eslint-disable jest/require-hook */
import {
  WalletModalProvider as ReactUIWalletModalProvider,
  // WalletConnectButton,
  // WalletDisconnectButton,
  // WalletModalButton,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';

require('@solana/wallet-adapter-react-ui/styles.css');

export const SolanaWallet = () => (
  <ReactUIWalletModalProvider>
    <WalletMultiButton />
  </ReactUIWalletModalProvider>
);
