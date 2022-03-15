export const CONSTANTS = {
  ETH_GETBALANCE: 'eth_getBalance',
  ETH_REQUESTACCOUNTS: 'eth_requestAccounts',
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

export const ServiceState = {
  0: 'Non Existent',
  1: 'Pre Registration',
  2: 'Active Registration',
  3: 'Expired Registration',
  4: 'Finished Registration',
  5: 'Deployed',
  6: 'Terminated Bonded',
  7: 'Terminated Unbonded',
};
