import { InjectedConnector } from '@web3-react/injected-connector';
import { CHAIN_ID } from 'util/constants';

const injected = new InjectedConnector({
  supportedNetworks: [1, 3, 4, 5, 42],
  supportedChainIds: [CHAIN_ID],
});

export default injected;
