import Web3 from 'web3';
import { isL1Network } from '@autonolas/frontend-library';

import {
  REGISTRIES_MANAGER_CONTRACT,
  AGENT_REGISTRY_CONTRACT,
  COMPONENT_REGISTRY_CONTRACT,
  SERVICE_MANAGER_CONTRACT,
  SERVICE_REGISTRY_CONTRACT,
  SERVICE_MANAGER_TOKEN_CONTRACT,
  SERVICE_REGISTRY_L2,
  SERVICE_REGISTRY_TOKEN_UTILITY_CONTRACT,
  SIGN_MESSAGE_LIB_CONTRACT,
  GNOSIS_SAFE_CONTRACT,
  MULTI_SEND_CONTRACT,
  GENERIC_ERC20_CONTRACT,
  OPERATOR_WHITELIST_CONTRACT,
} from 'common-util/AbiAndAddresses';
import {
  getChainId,
  getProvider,
  doesNetworkHaveValidServiceManagerTokenFn,
} from 'common-util/functions';
import {
  LOCAL_FORK_ID,
  LOCAL_FORK_ID_GNOSIS,
  LOCAL_FORK_ID_POLYGON,
} from 'util/constants';
import { ADDRESSES } from './addresses';

export const RPC_URLS = {
  1: process.env.NEXT_PUBLIC_MAINNET_URL,
  5: process.env.NEXT_PUBLIC_GOERLI_URL,
  100: process.env.NEXT_PUBLIC_GNOSIS_URL,
  137: process.env.NEXT_PUBLIC_POLYGON_URL,
  10200: process.env.NEXT_PUBLIC_GNOSIS_CHIADO_URL,
  80001: process.env.NEXT_PUBLIC_POLYGON_MUMBAI_URL,
  31337: process.env.NEXT_PUBLIC_AUTONOLAS_URL,
  42161: process.env.NEXT_PUBLIC_ARBITRUM_URL,
  421614: process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_URL,
  [LOCAL_FORK_ID]: 'http://localhost:8545',
  [LOCAL_FORK_ID_GNOSIS]: 'http://localhost:8545',
  [LOCAL_FORK_ID_POLYGON]: 'http://localhost:8545',
};

/**
 * returns the web3 details
 */
export const getWeb3Details = () => {
  const web3 = new Web3(getProvider());
  const chainId = getChainId();
  const address = ADDRESSES[chainId];

  return { web3, address, chainId };
};

/**
 * returns the contract instance
 * @param {Array} abi - abi of the contract
 * @param {String} contractAddress - address of the contract
 */
const getContract = (abi, contractAddress) => {
  const { web3 } = getWeb3Details();
  const contract = new web3.eth.Contract(abi, contractAddress);
  return contract;
};

/**
 * @returns componentRegistry contract
 */
export const getComponentContract = () => {
  const { address } = getWeb3Details();
  const { componentRegistry } = address;

  const contract = getContract(
    COMPONENT_REGISTRY_CONTRACT.abi,
    componentRegistry,
  );
  return contract;
};

/**
 * @returns agentRegistry contract
 */
export const getAgentContract = () => {
  const { address } = getWeb3Details();
  const { agentRegistry } = address;
  const contract = getContract(AGENT_REGISTRY_CONTRACT.abi, agentRegistry);
  return contract;
};

/**
 * @returns registriesManager contract
 */
export const getMechMinterContract = () => {
  const { address } = getWeb3Details();
  const { registriesManager } = address;
  const contract = getContract(
    REGISTRIES_MANAGER_CONTRACT.abi,
    registriesManager,
  );

  return contract;
};

/**
 *
 * @returns serviceRegistry contract
 */
export const getServiceContract = () => {
  const { address, chainId } = getWeb3Details();
  if (isL1Network(chainId)) {
    const { serviceRegistry } = address;
    const contract = getContract(
      SERVICE_REGISTRY_CONTRACT.abi,
      serviceRegistry,
    );
    return contract;
  }

  const { serviceRegistryL2 } = address;
  const contract = getContract(SERVICE_REGISTRY_L2.abi, serviceRegistryL2);
  return contract;
};

/**
 * @returns serviceManager contract
 */
export const getServiceManagerContract = () => {
  const { address, chainId } = getWeb3Details();
  if (doesNetworkHaveValidServiceManagerTokenFn(chainId)) {
    const { serviceManagerToken } = address;
    const contract = getContract(
      SERVICE_MANAGER_TOKEN_CONTRACT.abi,
      serviceManagerToken,
    );
    return contract;
  }

  const { serviceManager } = address;
  const contract = getContract(SERVICE_MANAGER_CONTRACT.abi, serviceManager);
  return contract;
};

/**
 * @returns serviceRegistryTokenUtility contract
 */
export const getServiceRegistryTokenUtilityContract = () => {
  const { address } = getWeb3Details();
  const { serviceRegistryTokenUtility } = address;
  const contract = getContract(
    SERVICE_REGISTRY_TOKEN_UTILITY_CONTRACT.abi,
    serviceRegistryTokenUtility,
  );
  return contract;
};

/**
 * @returns operatorWhitelist contract
 */
export const getOperatorWhitelistContract = () => {
  const { address } = getWeb3Details();
  const { operatorWhitelist } = address;
  const contract = getContract(
    OPERATOR_WHITELIST_CONTRACT.abi,
    operatorWhitelist,
  );
  return contract;
};

/**
 * @returns generic erc20 contract
 */
export const getGenericErc20Contract = (tokenAddress) => {
  const contract = getContract(GENERIC_ERC20_CONTRACT.abi, tokenAddress);
  return contract;
};

/**
 * @returns signMessageLib contract
 */
export const getSignMessageLibContract = (address) => {
  const contract = getContract(SIGN_MESSAGE_LIB_CONTRACT.abi, address);
  return contract;
};

/**
 * @returns multisig contract
 */
export const getServiceOwnerMultisigContract = (address) => {
  const contract = getContract(GNOSIS_SAFE_CONTRACT.abi, address);
  return contract;
};

/**
 * @returns multiSend contract
 */
export const getMultiSendContract = (address) => {
  const contract = getContract(MULTI_SEND_CONTRACT.abi, address);
  return contract;
};
