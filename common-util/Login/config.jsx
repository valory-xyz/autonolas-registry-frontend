import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from '@web3modal/ethereum';
import { configureChains, createConfig } from 'wagmi';
import {
  mainnet,
  gnosis,
  polygon,
  goerli,
  polygonMumbai,
  gnosisChiado,
} from 'wagmi/chains';
// import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

export const chains = [
  mainnet,
  goerli,
  gnosis,
  gnosisChiado,
  polygon,
  polygonMumbai,
];
export const projectId = process.env.NEXT_PUBLIC_WALLET_PROJECT_ID;

const {
  publicClient,
  // webSocketPublicClient
} = configureChains(chains, [
  w3mProvider({ projectId }),
]);

// NOT USE
// export const connector = new WalletConnectConnector({
//   options: {
//     qrcode: true,
//     rpc: {
//       1: process.env.NEXT_PUBLIC_MAINNET_URL,
//       5: process.env.NEXT_PUBLIC_GOERLI_URL,
//       100: process.env.NEXT_PUBLIC_GNOSIS_URL,
//       137: process.env.NEXT_PUBLIC_POLYGON_URL,
//       31337: process.env.NEXT_PUBLIC_AUTONOLAS_URL,
//     },
//   },
// });

// export const walletConnector = new WalletConnectConnector({
//   options: {
//     projectId: '...',
//     isNewChainsStale: false,
//   },
// });

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({
    projectId,
    version: 2, // v2 of wallet connect
    chains,
  }),
  // webSocketPublicClient,
  publicClient,
});

export const ethereumClient = new EthereumClient(wagmiConfig, chains);
