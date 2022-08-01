export const STAGING_CHAIN_ID = 31337;

export const SUPPORTED_NETWORKS = [1, STAGING_CHAIN_ID];

export const NA = 'NA';

export const CONSTANTS = {
  ETH_GETBALANCE: 'eth_getBalance',
  ETH_REQUESTACCOUNTS: 'eth_requestAccounts',
  DISCONNECT: 'disconnect_metamask',
};

export const URL = {
  root: '/',
  AGENTS: '/agents',
  COMPONENTS: '/components',
  OPERATORS: '/operators',
  SERVICES: '/services',
  REGISTER_AGENT: '/agents/register',
  REGISTER_COMPONENT: '/components/register',
  REGISTER_OPERATOR: '/operators/register',
  REGISTER_SERVICE: '/services/register',
  UPDATE_SERVICE: '/services/update',
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

export const SERVICE_STATE_INFO = {
  0: 'No service has been registered with a specified Id yet or the service is non-recoverable.',
  1: 'Agent instance registration is not active yet.',
  2: 'Agent instance registration is ongoing.',
  3: 'Deadline for agent instance registration has passed.',
  4: 'All the agent instances slots are registered.',
  5: 'Service is deployed and operates via created safe contract.',
  6: 'Some agents are bonded with stake.',
  7: 'All agents have left the service and recovered their stake.',
};

export const HASH_PREFIX = 'f01701220';
export const HASH_PREFIXES = {
  type1: HASH_PREFIX,
  type2: 'bafybei',
};

export const GATEWAY_URL = 'https://gateway.autonolas.tech/ipfs/';
