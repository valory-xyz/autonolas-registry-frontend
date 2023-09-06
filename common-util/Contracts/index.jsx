/* eslint-disable import/no-extraneous-dependencies */
import Web3 from 'web3';
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
import { isL1Network, getChainId } from 'common-util/functions';
import {
  LOCAL_FORK_ID,
  LOCAL_FORK_ID_GNOSIS,
  LOCAL_FORK_ID_POLYGON,
} from 'util/constants';

export const rpc = {
  1: process.env.NEXT_PUBLIC_MAINNET_URL,
  5: process.env.NEXT_PUBLIC_GOERLI_URL,
  100: process.env.NEXT_PUBLIC_GNOSIS_URL,
  137: process.env.NEXT_PUBLIC_POLYGON_URL,
  10200: process.env.NEXT_PUBLIC_GNOSIS_CHIADO_URL,
  80001: process.env.NEXT_PUBLIC_POLYGON_MUMBAI_URL,
  31337: process.env.NEXT_PUBLIC_AUTONOLAS_URL,
  [LOCAL_FORK_ID]: 'http://localhost:8545',
  [LOCAL_FORK_ID_GNOSIS]: 'http://localhost:8545',
  [LOCAL_FORK_ID_POLYGON]: 'http://localhost:8545',
};

const MAINNET_ADDRESSES = {
  agentRegistry: '0x2F1f7D38e4772884b88f3eCd8B6b9faCdC319112',
  componentRegistry: '0x15bd56669F57192a97dF41A2aa8f4403e9491776',
  registriesManager: '0x9eC9156dEF5C613B2a7D4c46C383F9B58DfcD6fE',
  serviceManagerToken: '0x2EA682121f815FBcF86EA3F3CaFdd5d67F2dB143',
  serviceRegistry: '0x48b6af7B12C71f09e2fC8aF4855De4Ff54e775cA',
  serviceRegistryTokenUtility: '0x3Fb926116D454b95c669B6Bf2E7c3bad8d19affA',
  operatorWhitelist: '0x42042799B0DE38AdD2a70dc996f69f98E1a85260',
};

const GNOSIS_ADDRESSES = {
  serviceManager: '0xE3607b00E75f6405248323A9417ff6b39B244b50',
  serviceRegistryL2: '0x9338b5153AE39BB89f50468E608eD9d764B755fD',
};

const POLYGON_ADDRESSES = {
  serviceManager: '0x3C1fF68f5aa342D296d4DEe4Bb1cACCA912D95fE',
  serviceRegistryL2: '0xE3607b00E75f6405248323A9417ff6b39B244b50',
};

// get addresses from scripts/deployment folder in autonolas-registries repo
export const ADDRESSES = {
  1: MAINNET_ADDRESSES,
  // goerli
  5: {
    agentRegistry: '0xEB5638eefE289691EcE01943f768EDBF96258a80',
    componentRegistry: '0x7Fd1F4b764fA41d19fe3f63C85d12bf64d2bbf68',
    registriesManager: '0x10c5525F77F13b28f42c5626240c001c2D57CAd4',
    serviceManagerToken: '0x1d333b46dB6e8FFd271b6C2D2B254868BD9A2dbd',
    serviceRegistry: '0x1cEe30D08943EB58EFF84DD1AB44a6ee6FEff63a',
    serviceRegistryTokenUtility: '0x6d9b08701Af43D68D991c074A27E4d90Af7f2276',
    operatorWhitelist: '0x0338893fB1A1D9Df03F72CC53D8f786487d3D03E',
  },
  // gnosis
  100: GNOSIS_ADDRESSES,
  // polygon
  137: POLYGON_ADDRESSES,
  // chiado
  10200: {
    serviceManager: '0x29086141ecdc310058fc23273F8ef7881d20C2f7',
    serviceRegistryL2: '0x31D3202d8744B16A120117A053459DDFAE93c855',
  },
  // polygon mumbai
  80001: {
    serviceManager: '0x43d28764bB39936185c84906983fB57A8A905a4F',
    serviceRegistryL2: '0xf805DfF246CC208CD2F08ffaD242b7C32bc93623',
  },
  // local
  31337: {
    agentRegistry: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    componentRegistry: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    registriesManager: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
    serviceRegistry: '0x998abeb3E57409262aE5b751f60747921B33613E',
    serviceManager: '0x4c5859f0F772848b2D91F1D83E2Fe57935348029',
    serviceRegistryTokenUtility: '0x36C02dA8a0983159322a80FFE9F24b1acfF8B570',
    operatorWhitelist: '0x809d550fca64d94Bd9F66E60752A544199cfAC3D',
    // used for testing - service creation/update token address
    ERC20Token: '0x1291Be112d480055DaFd8a610b7d1e203891C274',
  },
  [LOCAL_FORK_ID]: MAINNET_ADDRESSES,
  [LOCAL_FORK_ID_GNOSIS]: GNOSIS_ADDRESSES,
  [LOCAL_FORK_ID_POLYGON]: POLYGON_ADDRESSES,
};

export const getMyProvider = () => window.MODAL_PROVIDER
  || window.ethereum
  || process.env.NEXT_PUBLIC_MAINNET_URL;

/**
 *
 * @returns {Web3<RegisteredSubscription>} - provider
 * @returns {Promise<ethers.JsonRpcSigner>} signer to sign the transaction
 */
export const getWeb3Details = () => {
  const chainId = getChainId() || 1; // default to mainnet
  const address = ADDRESSES[chainId];
  const provider = new Web3(
    window.MODAL_PROVIDER || window.ethereum || rpc[chainId],
  );

  return {
    address,
    chainId,
    provider,
  };
};

/**
 * returns the contract instance
 * @param {Array} abi - abi of the contract
 * @param {String} contractAddress - address of the contract
 */
const getContract = (abi, contractAddress) => {
  const { provider } = getWeb3Details();
  const contract = new provider.eth.Contract(abi, contractAddress);
  return contract;
};

export const getComponentContract = async () => {
  const { address } = await getWeb3Details();
  const { componentRegistry } = address;
  const contract = getContract(
    COMPONENT_REGISTRY_CONTRACT.abi,
    componentRegistry,
  );
  return contract;
};

export const getAgentContract = async () => {
  const { address } = await getWeb3Details();
  const { agentRegistry } = address;
  const contract = getContract(AGENT_REGISTRY_CONTRACT.abi, agentRegistry);
  return contract;
};

export const getMechMinterContract = async () => {
  const { address } = await getWeb3Details();
  const { registriesManager } = address;

  const contract = getContract(
    REGISTRIES_MANAGER_CONTRACT.abi,
    registriesManager,
  );

  return contract;
};

/**
 *
 * @returns {Promise<ethers.Contract>} serviceRegistry contract
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
 * @returns {ethers.Contract} serviceManager contract
 */
export const getServiceManagerContract = () => {
  const { address } = getWeb3Details();
  const { serviceManagerToken } = address;
  const contract = getContract(
    SERVICE_MANAGER_TOKEN_CONTRACT.abi,
    serviceManagerToken,
  );
  return contract;
};

/**
 * @returns {ethers.Contract} serviceManager L2 contract
 */
export const getServiceManagerL2Contract = async () => {
  const { address } = await getWeb3Details();
  const { serviceManager } = address;
  const contract = getContract(SERVICE_MANAGER_CONTRACT.abi, serviceManager);
  return contract;
};

export const getServiceRegistryTokenUtilityContract = async () => {
  const { address } = await getWeb3Details();
  const { serviceRegistryTokenUtility } = address;
  const contract = getContract(
    SERVICE_REGISTRY_TOKEN_UTILITY_CONTRACT.abi,
    serviceRegistryTokenUtility,
  );
  return contract;
};

export const getOperatorWhitelistContract = async () => {
  const { address } = await getWeb3Details();
  const { operatorWhitelist } = address;
  const contract = getContract(
    OPERATOR_WHITELIST_CONTRACT.abi,
    operatorWhitelist,
  );
  return contract;
};

export const getGenericErc20Contract = async (tokenAddress) => {
  const contract = getContract(GENERIC_ERC20_CONTRACT.abi, tokenAddress);
  return contract;
};

export const getSignMessageLibContract = async (address) => {
  const contract = getContract(SIGN_MESSAGE_LIB_CONTRACT.abi, address);
  return contract;
};

export const getServiceOwnerMultisigContract = async (address) => {
  const contract = getContract(GNOSIS_SAFE_CONTRACT.abi, address);
  return contract;
};

export const getMultiSendContract = async (address) => {
  const contract = getContract(MULTI_SEND_CONTRACT.abi, address);
  return contract;
};

/**
 * Other details
 * Addresses: https://github.com/safe-global/safe-deployments/tree/main/src/assets/v1.3.0
 */

export const multisigAddresses = {
  1: ['0x46C0D07F55d4F9B5Eed2Fc9680B5953e5fd7b461'],
  5: ['0x65dD51b02049ad1B6FF7fa9Ea3322E1D2CAb1176'],
  100: ['0x3C1fF68f5aa342D296d4DEe4Bb1cACCA912D95fE'],
  137: ['0x3d77596beb0f130a4415df3D2D8232B3d3D31e44'],
  10200: ['0xeB49bE5DF00F74bd240DE4535DDe6Bc89CEfb994'],
  80001: ['0x9dEc6B62c197268242A768dc3b153AE7a2701396'],
  31337: ['0x0E801D84Fa97b50751Dbf25036d067dCf18858bF'],
  [LOCAL_FORK_ID]: ['0x46C0D07F55d4F9B5Eed2Fc9680B5953e5fd7b461'],
  [LOCAL_FORK_ID_GNOSIS]: ['0x3C1fF68f5aa342D296d4DEe4Bb1cACCA912D95fE'],
  [LOCAL_FORK_ID_POLYGON]: ['0x3d77596beb0f130a4415df3D2D8232B3d3D31e44'],
};

export const multisigSameAddresses = {
  1: ['0x26Ea2dC7ce1b41d0AD0E0521535655d7a94b684c'],
  5: ['0x92499E80f50f06C4078794C179986907e7822Ea1'],
  100: ['0x3d77596beb0f130a4415df3D2D8232B3d3D31e44'],
  137: ['0x34C895f302D0b5cf52ec0Edd3945321EB0f83dd5'],
  10200: ['0x5BA58970c2Ae16Cf6218783018100aF2dCcFc915'],
  80001: ['0xB575dd20281c63288428DD58e5f579CC7d6aae4d'],
  31337: ['0x8f86403A4DE0BB5791fa46B8e795C547942fE4Cf'],
  [LOCAL_FORK_ID]: ['0x26Ea2dC7ce1b41d0AD0E0521535655d7a94b684c'],
  [LOCAL_FORK_ID_GNOSIS]: ['0x3d77596beb0f130a4415df3D2D8232B3d3D31e44'],
  [LOCAL_FORK_ID_POLYGON]: ['0x34C895f302D0b5cf52ec0Edd3945321EB0f83dd5'],
};

export const safeMultiSend = {
  1: ['0x40A2aCCbd92BCA938b02010E17A5b8929b49130D'],
  5: ['0x40A2aCCbd92BCA938b02010E17A5b8929b49130D'],
  100: ['0x40A2aCCbd92BCA938b02010E17A5b8929b49130D'],
  137: ['0x40A2aCCbd92BCA938b02010E17A5b8929b49130D'],
  10200: ['0x40A2aCCbd92BCA938b02010E17A5b8929b49130D'],
  80001: ['0x40A2aCCbd92BCA938b02010E17A5b8929b49130D'],
  31337: ['0x9d4454B023096f34B160D6B654540c56A1F81688'],
  [LOCAL_FORK_ID]: ['0x40A2aCCbd92BCA938b02010E17A5b8929b49130D'],
  [LOCAL_FORK_ID_GNOSIS]: ['0x40A2aCCbd92BCA938b02010E17A5b8929b49130D'],
  [LOCAL_FORK_ID_POLYGON]: ['0x40A2aCCbd92BCA938b02010E17A5b8929b49130D'],
};

export const FALLBACK_HANDLER = {
  1: '0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4',
  5: '0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4',
  100: '0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4',
  137: '0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4',
  10200: '0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4',
  80001: '0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4',
  31337: '0x0000000000000000000000000000000000000000',
  [LOCAL_FORK_ID]: '0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4',
  [LOCAL_FORK_ID_GNOSIS]: '0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4',
  [LOCAL_FORK_ID_POLYGON]: '0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4',
};
