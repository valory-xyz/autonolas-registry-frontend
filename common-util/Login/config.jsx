import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from '@web3modal/ethereum';
// import { infuraProvider } from 'wagmi/providers/infura';
// import { alchemyProvider } from 'wagmi/providers/alchemy';
import { rpc } from 'common-util/Contracts';

import { configureChains, createConfig } from 'wagmi';
import {
  mainnet,
  gnosis,
  polygon,
  goerli,
  polygonMumbai,
  gnosisChiado,
} from 'wagmi/chains';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { publicProvider } from 'wagmi/providers/public';
import { SafeConnector } from 'wagmi/connectors/safe';
import { WalletConnectLegacyConnector } from 'wagmi/connectors/walletConnectLegacy';

export const chains = [
  mainnet,
  goerli,
  gnosis,
  gnosisChiado,
  polygon,
  polygonMumbai,
];
export const projectId = process.env.NEXT_PUBLIC_WALLET_PROJECT_ID;

const { publicClient } = configureChains(chains, [
  publicProvider(),
  // w3mProvider({ projectId }),
  // infuraProvider({ apiKey: 'a5184169a2dd4263b4c164a088353eec', weight: 1 }),
]);

export const wagmiConfig = createConfig({
  autoConnect: true,
  logger: true,
  // connectors: w3mConnectors({
  //   projectId,
  //   version: 2, // v2 of wallet connect
  //   chains,
  // }),
  connectors: [
    // new InjectedConnector({ chains }),
    // new WalletConnectConnector({
    //   chains,
    //   options: {
    //     projectId,
    //   },
    // }),
    ...w3mConnectors({
      projectId,
      version: 2, // v2 of wallet connect
      chains,
    }),
    new SafeConnector({
      chains,
      options: {
        allowedDomains: [/gnosis-safe.io$/, /app.safe.global$/],
        debug: false,
      },
    }),
    // new WalletConnectLegacyConnector({
    //   chains,
    //   options: {
    //     projectId,
    //     rpc,
    //   },
    // }),
  ],
  publicClient,
});

export const ethereumClient = new EthereumClient(wagmiConfig, chains);
