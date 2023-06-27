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

export const chains = [
  mainnet,
  goerli,
  gnosis,
  // gnosisChiado,
  polygon,
  // polygonMumbai,
];
export const projectId = process.env.NEXT_PUBLIC_WALLET_PROJECT_ID;

const { publicClient } = configureChains(chains, [
  // infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_API_KEY, weight: 1 }),
  w3mProvider({ projectId, stallTimeout: 1000 }),
  // jsonRpcProvider({
  //   rpc: (chain) => {
  //     console.log(chain, rpc[chain.id]);
  //     return {
  //       http: rpc[chain.id],
  //     };
  //   },
  //   // stallTimeout: 1000,
  // }),
  // NEXT_PUBLIC_INFURA_API_KEY
  // publicProvider(),
]);

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    ...w3mConnectors({
      projectId,
      version: 2, // v2 of wallet connect
      chains,
    }),
    // new SafeConnector({
    //   chains,
    //   options: {
    //     allowedDomains: [/gnosis-safe.io$/, /app.safe.global$/],
    //     debug: false,
    //   },
    // }),
  ],
  publicClient,
});

export const ethereumClient = new EthereumClient(wagmiConfig, chains);
