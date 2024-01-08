export const URL = {
  AGENTS: '/agents',
  COMPONENTS: '/components',
  SERVICES: '/services',
  MINT_AGENT: '/agents/mint',
  MINT_COMPONENT: '/components/mint',
  MINT_SERVICE: '/services/mint',
  UPDATE_SERVICE: '/services/update',

  // pages without chain id
  DISCLAIMER: '/disclaimer',
  PAGE_NOT_FOUND: '/page-not-found',
  NOT_LEGAL: '/not-legal',
};

export const NAV_TYPES = {
  COMPONENT: 'component',
  AGENT: 'agent',
  OPERATOR: 'operator',
  SERVICE: 'service',
};

export const SERVICE_STATE = {
  0: 'Non Existent',
  1: 'Pre Registration',
  2: 'Active Registration',
  3: 'Finished Registration',
  4: 'Deployed',
  5: 'Terminated Bonded',
};

// should not display contracts on homepage nor load with chain Ids
export const PAGES_TO_LOAD_WITHOUT_CHAINID = [
  '/disclaimer',
  '/page-not-found',
  '/not-legal',
];

export const HASH_PREFIX = 'f01701220';
export const HASH_PREFIXES = {
  type1: HASH_PREFIX,
  type2: 'bafybei',
};

export const GATEWAY_URL = 'https://gateway.autonolas.tech/ipfs/';

// max componets/agents/service to be shown in a single view
export const TOTAL_VIEW_COUNT = 10;

export const DEFAULT_SERVICE_CREATION_ETH_TOKEN = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

export const DEFAULT_SERVICE_CREATION_ETH_TOKEN_ZEROS = '0x0000000000000000000000000000000000000000';

// used for local testing
export const LOCAL_FORK_ID = 100000;
export const LOCAL_FORK_ID_GNOSIS = 100001;
export const LOCAL_FORK_ID_POLYGON = 100002;

export const DEFAULT_CHAIN_ID = 1;

// TODO: move to autonolas-frontend-library
export const EXTRA_COLORS = {
  YELLOW_PRIMARY: '#eab308', // tailwind orange.500
  YELLOW_SECONDARY: '#fefce8', // tailwind orange.50
};

export const BLOCKCHAIN_NAME = {
  ETHEREUM: 'ethereum',
  SOLANA: 'solana',
};
