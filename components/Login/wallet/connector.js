// connecting to certain waller
// injected-connector is for metamask
import { InjectedConnector } from '@web3-react/injected-connector';

// google crypto wallet chain IDs
export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 43114],
});

export const AB = null;
