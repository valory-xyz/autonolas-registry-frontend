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
import { SafeConnector } from 'wagmi/connectors/safe';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

import { VM_TYPE } from 'util/constants';
import { RPC_URLS } from 'common-util/Contracts';

export const projectId = process.env.NEXT_PUBLIC_WALLET_PROJECT_ID;

export const SUPPORTED_CHAINS = [
  mainnet,
  goerli,
  gnosis,
  gnosisChiado,
  polygon,
  polygonMumbai,
];

const { publicClient, webSocketPublicClient, chains } = configureChains(
  SUPPORTED_CHAINS,
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: RPC_URLS[chain.id],
      }),
    }),
    w3mProvider({ projectId }),
  ],
);

export const wagmiConfig = createConfig({
  autoConnect: true,
  logger: { warn: null },
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

/**
 * Returns the list of supported chains with more info such as
 * network name, network display name, etc
 * @example
 * [
 *  { name: 'Mainnet', id: 1, network: 'ethereum' },
 *  { name: 'Goerli', id: 5, network: 'goerli' },
 *  // ...
 * ]
 */
export const EVM_SUPPORTED_CHAINS = SUPPORTED_CHAINS.map((chain) => {
  const { name, network, id } = chain;

  const getNetworkName = () => {
    if (network === 'homestead') return 'ethereum';
    if (network === 'chiado') return 'gnosis-chiado';
    if (network === 'matic') return 'polygon';
    if (network === 'maticmum') return 'polygon-mumbai';
    return network;
  };

  return {
    id,
    networkDisplayName: name,
    networkName: getNetworkName(),
    vmType: VM_TYPE.EVM,
  };
});

/**
 * Solana supported chains
 */
export const SVM_SOLANA_CHAIN = {
  id: null,
  networkDisplayName: 'Solana',
  networkName: 'solana',
  vmType: VM_TYPE.SVM,
};

export const SVM_SOLANA_DEVNET_CHAIN = {
  id: null,
  networkDisplayName: 'Solana Devnet',
  networkName: 'solana-devnet',
  vmType: VM_TYPE.SVM,
};

export const SVM_SUPPORTED_CHAINS = [
  { ...SVM_SOLANA_CHAIN },
  { ...SVM_SOLANA_DEVNET_CHAIN },
];

/**
 * Returns the list of all supported chains.
 */
export const ALL_SUPPORTED_CHAINS = [
  ...EVM_SUPPORTED_CHAINS,
  ...SVM_SUPPORTED_CHAINS,
];
