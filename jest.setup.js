/* eslint-disable jest/require-hook */
import '@testing-library/jest-dom/jest-globals';

// https:// jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

jest.mock('ipfs-only-hash', () => ({
  of: jest.fn(),
}));

jest.mock('common-util/Login', () => ({
  SUPPORTED_CHAINS: [{ id: 1 }],
}));

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

const mockEthereumClient = {
  disconnect: jest.fn(),
  getAccount: jest.fn(),
  watchAccount: jest.fn(),
  fetchBalance: jest.fn(),
  getNetwork: jest.fn(),
  watchNetwork: jest.fn(),
  switchNetwork: jest.fn(),
  fetchEnsName: jest.fn(),
  fetchEnsAvatar: jest.fn(),
  connect: jest.fn(),
};

jest.mock('@web3modal/ethereum', () => ({
  EthereumClient: mockEthereumClient,
  w3mConnectors: jest.fn(),
  w3mProvider: jest.fn(),

}));

jest.mock('wagmi', () => ({
  configureChains: jest.fn(),
  createConfig: jest.fn(),
}));

jest.mock('wagmi/chains', () => ({
  mainnet: { chainId: 1, chainName: 'Ethereum Mainnet' },
  goerli: { chainId: 5, chainName: 'Goerli Testnet' },
  gnosis: { chainId: 100, chainName: 'Gnosis Safe' },
  gnosisChiado: { chainId: 101, chainName: 'Gnosis Safe Chiado' },
  polygon: { chainId: 137, chainName: 'Polygon Mainnet' },
  polygonMumbai: { chainId: 80001, chainName: 'Polygon Mumbai Testnet' },
}));

jest.mock('wagmi/connectors/safe', () => ({
  SafeConnector: jest.fn(),
}));

jest.mock('wagmi/providers/jsonRpc', () => ({
  jsonRpcProvider: jest.fn(),
}));

jest.mock('publicClient', () => ({
  getPublicClient: jest.fn(),
}));

// const mockConfigureChains = jest.fn().mockReturnValue({
//   publicClient: mockEthereumClient,
//   webSocketPublicClient: mockEthereumClient,
//   chains: [],
// });
