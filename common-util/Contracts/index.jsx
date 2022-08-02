import Web3 from 'web3';
import {
  REGISTRIES_MANAGER_CONTRACT,
  AGENT_REGISTRY_CONTRACT,
  COMPONENT_REGISTRY_CONTRACT,
  SERVICE_REGISTRY_CONTRACT,
  SERVICE_MANAGER_CONTRACT,
} from 'common-util/AbiAndAddresses';
import { STAGING_CHAIN_ID } from 'util/constants';

const ADDRESSES = {
  1: {
    agentRegistry: '0x2F1f7D38e4772884b88f3eCd8B6b9faCdC319112',
    componentRegistry: '0x15bd56669F57192a97dF41A2aa8f4403e9491776',
    registriesManager: '0x9eC9156dEF5C613B2a7D4c46C383F9B58DfcD6fE',
    serviceManager: '0x38b062d11CD7596Ab5aDFe4d0e9F0dC3218E5389',
    serviceRegistry: '0x48b6af7B12C71f09e2fC8aF4855De4Ff54e775cA',
  },
  31337: {
    agentRegistry: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    componentRegistry: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    registriesManager: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
    serviceManager: '0x9A676e781A523b5d0C0e43731313A708CB607508',
    serviceRegistry: '0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82',
  },
};

const getWeb3Details = () => {
  const chainId = Number(window.ethereum.chainId);
  const address = ADDRESSES[chainId || STAGING_CHAIN_ID]; // default fallback to be 31337
  return { address };
};

export const getMechMinterContract = () => {
  const web3 = new Web3(window.web3.currentProvider);
  const { registriesManager } = getWeb3Details().address;
  const contract = new web3.eth.Contract(
    REGISTRIES_MANAGER_CONTRACT.abi,
    registriesManager,
  );
  return contract;
};

export const getAgentContract = () => {
  const web3 = new Web3(window.web3.currentProvider);
  const { agentRegistry } = getWeb3Details().address;
  const contract = new web3.eth.Contract(
    AGENT_REGISTRY_CONTRACT.abi,
    agentRegistry,
  );
  return contract;
};

export const getComponentContract = () => {
  const web3 = new Web3(window.web3.currentProvider);
  const { componentRegistry } = getWeb3Details().address;
  const contract = new web3.eth.Contract(
    COMPONENT_REGISTRY_CONTRACT.abi,
    componentRegistry,
  );
  return contract;
};

export const getServiceContract = () => {
  const web3 = new Web3(window.web3.currentProvider);
  const { serviceRegistry } = getWeb3Details().address;
  const contract = new web3.eth.Contract(
    SERVICE_REGISTRY_CONTRACT.abi,
    serviceRegistry,
  );
  return contract;
};

export const getServiceManagerContract = () => {
  const { serviceManager } = getWeb3Details().address;
  const web3 = new Web3(window.web3.currentProvider);
  const contract = new web3.eth.Contract(
    SERVICE_MANAGER_CONTRACT.abi,
    serviceManager,
  );
  return contract;
};
