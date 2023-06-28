import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from '@web3modal/ethereum';
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
import { SafeConnector } from 'wagmi/connectors/safe';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';
import { infuraProvider } from 'wagmi/providers/infura';

export const projectId = process.env.NEXT_PUBLIC_WALLET_PROJECT_ID;

const { publicClient, webSocketPublicClient, chains } = configureChains(
  [
    mainnet,
    goerli,
    gnosis,
    // gnosisChiado,
    polygon,
  // polygonMumbai,
  ],
  [
    // infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_API_KEY, weight: 1 }),
    jsonRpcProvider({
      rpc: (chain) => {
        console.log(chain);
        console.log(rpc[chain.id], typeof rpc[chain.id]);
        return {
          http: rpc[chain.id],
        };
      },
    }),
    w3mProvider({ projectId }),
    // NEXT_PUBLIC_INFURA_API_KEY
    // publicProvider(),
  ],
  {
    // rank: true,
    // stallTimeout: 5000,
  },
);

export const wagmiConfig = createConfig({
  autoConnect: true,
  logger: {
    warn: null,
  },
  connectors: [
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
  ],
  publicClient,
  webSocketPublicClient,
});

export const ethereumClient = new EthereumClient(wagmiConfig, chains);
