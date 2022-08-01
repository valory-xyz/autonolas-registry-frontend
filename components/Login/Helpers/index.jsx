import { InjectedConnector } from '@web3-react/injected-connector';
import { SUPPORTED_NETWORKS } from 'util/constants';

const injected = new InjectedConnector({
  supportedNetworks: SUPPORTED_NETWORKS,
  supportedChainIds: SUPPORTED_NETWORKS,
});

export default injected;
