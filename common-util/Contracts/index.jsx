import Web3 from 'web3';
import {
  REGISTRIES_MANAGER_CONTRACT,
  REGISTRIES_MANAGER_ADDRESS,
  AGENT_REGISTRY_ADDRESS,
  AGENT_REGISTRY,
  COMPONENT_REGISTRY,
  COMPONENT_REGISTRY_ADDRESS,
  SERVICE_REGISTRY,
  SERVICE_REGISTRY_ADDRESS,
  SERVICE_MANAGER,
  SERVICE_MANAGER_ADDRESS,
} from 'common-util/AbiAndAddresses';

export const getMechMinterContract = () => {
  window.ethereum.enable();
  const web3 = new Web3(window.web3.currentProvider);
  const contract = new web3.eth.Contract(
    REGISTRIES_MANAGER_CONTRACT.abi,
    REGISTRIES_MANAGER_ADDRESS,
  );
  return contract;
};

export const getAgentContract = () => {
  window.ethereum.enable();
  const web3 = new Web3(window.web3.currentProvider);
  const contract = new web3.eth.Contract(
    AGENT_REGISTRY.abi,
    AGENT_REGISTRY_ADDRESS,
  );
  return contract;
};

export const getComponentContract = () => {
  window.ethereum.enable();
  const web3 = new Web3(window.web3.currentProvider);
  const contract = new web3.eth.Contract(
    COMPONENT_REGISTRY.abi,
    COMPONENT_REGISTRY_ADDRESS,
  );
  return contract;
};

export const getServiceContract = () => {
  window.ethereum.enable();
  const web3 = new Web3(window.web3.currentProvider);
  const contract = new web3.eth.Contract(
    SERVICE_REGISTRY.abi,
    SERVICE_REGISTRY_ADDRESS,
  );
  return contract;
};

export const getServiceManagerContract = () => {
  window.ethereum.enable();
  const web3 = new Web3(window.web3.currentProvider);
  const contract = new web3.eth.Contract(
    SERVICE_MANAGER.abi,
    SERVICE_MANAGER_ADDRESS,
  );
  return contract;
};
