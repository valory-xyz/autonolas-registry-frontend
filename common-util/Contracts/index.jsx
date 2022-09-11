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
    serviceManager: '0x70e0bA845a1A0F2DA3359C97E0285013525FFC49',
    serviceRegistry: '0x998abeb3E57409262aE5b751f60747921B33613E',
  },
};

const getWeb3Details = () => {
  /**
   * provider = wallect-connect provider or currentProvider by metamask
   */
  const web3 = new Web3(window.WEB3_PROVIDER || window.web3.currentProvider);

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
  31337: ['0x0E801D84Fa97b50751Dbf25036d067dCf18858bF'],
};

export const multisigSameAddresses = {
  1: ['0x26Ea2dC7ce1b41d0AD0E0521535655d7a94b684c'],
  5: ['0x92499E80f50f06C4078794C179986907e7822Ea1'],
  31337: ['0x8f86403A4DE0BB5791fa46B8e795C547942fE4Cf'],
};

export const safeMultiSend = {
  1: ['0x40A2aCCbd92BCA938b02010E17A5b8929b49130D'],
  5: ['0x40A2aCCbd92BCA938b02010E17A5b8929b49130D'],
  31337: ['0x9d4454B023096f34B160D6B654540c56A1F81688'],
};

export const gnosisSafeMaster = {
  1: '0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552',
  5: '0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552',
  31337: '0x4826533B4897376654Bb4d4AD88B7faFD0C98528',
};

export const rpcUrl = {
  1: 'https://mainnet.infura.io/v3/',
  5: 'https://goerli.infura.io/v3/',
  31337: 'http://localhost:8545',
};
