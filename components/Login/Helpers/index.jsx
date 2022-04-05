import { InjectedConnector } from '@web3-react/injected-connector';
import { SUPPORTED_NETWORKS, CHAIN_ID } from 'util/constants';

const injected = new InjectedConnector({
  supportedNetworks: SUPPORTED_NETWORKS,
  supportedChainIds: [CHAIN_ID],
});

export default injected;
