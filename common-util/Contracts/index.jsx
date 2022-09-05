import Web3 from 'web3';
import {
  REGISTRIES_MANAGER_CONTRACT,
  AGENT_REGISTRY_CONTRACT,
  COMPONENT_REGISTRY_CONTRACT,
  SERVICE_REGISTRY_CONTRACT,
  SERVICE_MANAGER_CONTRACT,
} from 'common-util/AbiAndAddresses';
import { STAGING_CHAIN_ID } from 'util/constants';

export const ADDRESSES = {
  1: {
    agentRegistry: '0x2F1f7D38e4772884b88f3eCd8B6b9faCdC319112',
    componentRegistry: '0x15bd56669F57192a97dF41A2aa8f4403e9491776',
    registriesManager: '0x9eC9156dEF5C613B2a7D4c46C383F9B58DfcD6fE',
    serviceManager: '0x38b062d11CD7596Ab5aDFe4d0e9F0dC3218E5389',
    serviceRegistry: '0x48b6af7B12C71f09e2fC8aF4855De4Ff54e775cA',
  },
  5: {
    agentRegistry: '0xEB5638eefE289691EcE01943f768EDBF96258a80',
    componentRegistry: '0x7Fd1F4b764fA41d19fe3f63C85d12bf64d2bbf68',
    registriesManager: '0x10c5525F77F13b28f42c5626240c001c2D57CAd4',
    serviceManager: '0xcDdD9D9ABaB36fFa882530D69c73FeE5D4001C2d',
    serviceRegistry: '0x1cEe30D08943EB58EFF84DD1AB44a6ee6FEff63a',
  },
  31337: {
    agentRegistry: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    componentRegistry: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    registriesManager: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
    serviceManager: '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e',
    serviceRegistry: '0x610178dA211FEF7D417bC0e6FeD39F05609AD788',
  },
};

const getWeb3Details = () => {
  /**
   * provider = wallect-connect provider or currentProvider by metamask
   */
  const web3 = new Web3(window.WEB3_PROVIDER || window.web3.currentProvider);

  console.log({
    web3,
    // G: web3.getSigner(),
  });
  const chainId = Number(window.ethereum.chainId);
  const address = ADDRESSES[chainId || STAGING_CHAIN_ID]; // default fallback to be 31337
  return { web3, address };
};

export const getComponentContract = () => {
  const { web3, address } = getWeb3Details();
  const { componentRegistry } = address;
  const contract = new web3.eth.Contract(
    COMPONENT_REGISTRY_CONTRACT.abi,
    componentRegistry,
  );
  return contract;
};

export const getAgentContract = () => {
  const { web3, address } = getWeb3Details();
  const { agentRegistry } = address;
  const contract = new web3.eth.Contract(
    AGENT_REGISTRY_CONTRACT.abi,
    agentRegistry,
  );
  return contract;
};

export const getMechMinterContract = () => {
  const { web3, address } = getWeb3Details();
  const { registriesManager } = address;
  const contract = new web3.eth.Contract(
    REGISTRIES_MANAGER_CONTRACT.abi,
    registriesManager,
  );
  return contract;
};

export const getServiceContract = () => {
  const { web3, address } = getWeb3Details();
  const { serviceRegistry } = address;
  const contract = new web3.eth.Contract(
    SERVICE_REGISTRY_CONTRACT.abi,
    serviceRegistry,
  );
  return contract;
};

export const getServiceManagerContract = () => {
  const { web3, address } = getWeb3Details();
  const { serviceManager } = address;
  const contract = new web3.eth.Contract(
    SERVICE_MANAGER_CONTRACT.abi,
    serviceManager,
  );
  return contract;
};

/**
 * Other details
 */

export const multisigAddresses = {
  1: ['0x46C0D07F55d4F9B5Eed2Fc9680B5953e5fd7b461'],
  5: ['0x65dD51b02049ad1B6FF7fa9Ea3322E1D2CAb1176'],
  31337: ['0x9A676e781A523b5d0C0e43731313A708CB607508'],
};

export const multisigSameAddresses = {
  1: ['0x26Ea2dC7ce1b41d0AD0E0521535655d7a94b684c'],
  5: ['0x92499E80f50f06C4078794C179986907e7822Ea1'],
  31337: ['0x0B306BF915C4d645ff596e518fAf3F9669b97016'],
};

export const safeMultiSend = {
  1: ['0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761'],
  5: ['0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761'],
  31337: ['0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1'],
};

export const gnosisSafeMaster = {
  1: '0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552',
  5: '0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552',
  31337: '0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0',
};
