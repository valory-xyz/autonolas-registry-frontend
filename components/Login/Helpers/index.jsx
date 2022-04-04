import { InjectedConnector } from '@web3-react/injected-connector';

const injected = new InjectedConnector({
  supportedNetworks: [1, 3, 4, 5, 42],
  supportedChainIds: [31337],
});

export default injected;
