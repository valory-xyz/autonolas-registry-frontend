import Web3 from 'web3';
import {
  REGISTRIES_MANAGER_CONTRACT,
  AGENT_REGISTRY_CONTRACT,
  COMPONENT_REGISTRY_CONTRACT,
  SERVICE_REGISTRY_CONTRACT,
  SERVICE_MANAGER_TOKEN_CONTRACT,
  SIGN_MESSAGE_LIB_CONTRACT,
  GNOSIS_SAFE_CONTRACT,
  MULTI_SEND_CONTRACT,
  SERVICE_REGISTRY_L2,
} from 'common-util/AbiAndAddresses';
import { isL1Network } from 'common-util/functions';

export const ADDRESSES = {
  1: {
    agentRegistry: '0x2F1f7D38e4772884b88f3eCd8B6b9faCdC319112',
    componentRegistry: '0x15bd56669F57192a97dF41A2aa8f4403e9491776',
    registriesManager: '0x9eC9156dEF5C613B2a7D4c46C383F9B58DfcD6fE',
    serviceManager: '0x38b062d11CD7596Ab5aDFe4d0e9F0dC3218E5389',
    serviceRegistry: '0x48b6af7B12C71f09e2fC8aF4855De4Ff54e775cA',
  },
  // goerli
  5: {
    agentRegistry: '0xEB5638eefE289691EcE01943f768EDBF96258a80',
    componentRegistry: '0x7Fd1F4b764fA41d19fe3f63C85d12bf64d2bbf68',
    registriesManager: '0x10c5525F77F13b28f42c5626240c001c2D57CAd4',
    serviceManager: '0xcDdD9D9ABaB36fFa882530D69c73FeE5D4001C2d',
    serviceRegistry: '0x1cEe30D08943EB58EFF84DD1AB44a6ee6FEff63a',
  },
  // gnosis
  100: {
    serviceManager: '0xE3607b00E75f6405248323A9417ff6b39B244b50',
    serviceRegistry: '0x9338b5153AE39BB89f50468E608eD9d764B755fD',
  },
  // polygon
  137: {
    serviceManager: '0x3C1fF68f5aa342D296d4DEe4Bb1cACCA912D95fE',
    serviceRegistry: '0xE3607b00E75f6405248323A9417ff6b39B244b50',
  },
  // chiado
  10200: {
    serviceManager: '0x29086141ecdc310058fc23273F8ef7881d20C2f7',
    serviceRegistry: '0x31D3202d8744B16A120117A053459DDFAE93c855',
  },
  // polygon mumbai
  80001: {
    serviceManager: '0x43d28764bB39936185c84906983fB57A8A905a4F',
    serviceRegistry: '0xf805DfF246CC208CD2F08ffaD242b7C32bc93623',
  },
  // local
  31337: {
    agentRegistry: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    componentRegistry: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    registriesManager: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
    serviceManager: '0x70e0bA845a1A0F2DA3359C97E0285013525FFC49',
    serviceRegistry: '0x998abeb3E57409262aE5b751f60747921B33613E',
  },
};

export const getWeb3Details = () => {
  /**
   * web3 provider =
   * - wallect-connect provider or
   * - currentProvider by metamask or
   * - fallback to remote mainnet [remote node provider](https://web3js.readthedocs.io/en/v1.7.5/web3.html#example-remote-node-provider)
   */
  const web3 = new Web3(
    window.WEB3_PROVIDER
      || window.web3?.currentProvider
      || process.env.NEXT_PUBLIC_MAINNET_URL,
  );

  const chainId = Number(window.ethereum?.chainId || 1); // default to mainnet
  const address = ADDRESSES[chainId];
  return { web3, address, chainId };
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
  const { web3, address, chainId } = getWeb3Details();
  const { serviceRegistry } = address;
  const contract = new web3.eth.Contract(
    isL1Network(chainId)
      ? SERVICE_REGISTRY_CONTRACT.abi
      : SERVICE_REGISTRY_L2.abi,
    serviceRegistry,
  );
  return contract;
};

export const getServiceManagerContract = () => {
  const { web3, address } = getWeb3Details();
  const { serviceManager } = address;
  const contract = new web3.eth.Contract(
    SERVICE_MANAGER_TOKEN_CONTRACT.abi,
    serviceManager,
  );
  return contract;
};

export const getSignMessageLibContract = (address) => {
  const { web3 } = getWeb3Details();
  const contract = new web3.eth.Contract(
    SIGN_MESSAGE_LIB_CONTRACT.abi,
    address,
  );
  return contract;
};

export const getServiceOwnerMultisigContract = (address) => {
  const { web3 } = getWeb3Details();
  const contract = new web3.eth.Contract(GNOSIS_SAFE_CONTRACT.abi, address);
  return contract;
};

export const getMultiSendContract = (address) => {
  const { web3 } = getWeb3Details();
  const contract = new web3.eth.Contract(MULTI_SEND_CONTRACT.abi, address);
  return contract;
};

/**
 * Other details
 */

export const multisigAddresses = {
  1: ['0x46C0D07F55d4F9B5Eed2Fc9680B5953e5fd7b461'],
  5: ['0x65dD51b02049ad1B6FF7fa9Ea3322E1D2CAb1176'],
  100: ['0x3C1fF68f5aa342D296d4DEe4Bb1cACCA912D95fE'],
  137: ['0x3d77596beb0f130a4415df3D2D8232B3d3D31e44'],
  10200: ['0xeB49bE5DF00F74bd240DE4535DDe6Bc89CEfb994'],
  80001: ['0x9dEc6B62c197268242A768dc3b153AE7a2701396'],
  31337: ['0x0E801D84Fa97b50751Dbf25036d067dCf18858bF'],
};

export const multisigSameAddresses = {
  1: ['0x26Ea2dC7ce1b41d0AD0E0521535655d7a94b684c'],
  5: ['0x92499E80f50f06C4078794C179986907e7822Ea1'],
  100: ['0x3d77596beb0f130a4415df3D2D8232B3d3D31e44'],
  137: ['0x34C895f302D0b5cf52ec0Edd3945321EB0f83dd5'],
  10200: ['0x5BA58970c2Ae16Cf6218783018100aF2dCcFc915'],
  80001: ['0xB575dd20281c63288428DD58e5f579CC7d6aae4d'],
  31337: ['0x8f86403A4DE0BB5791fa46B8e795C547942fE4Cf'],
};

export const safeMultiSend = {
  1: ['0x40A2aCCbd92BCA938b02010E17A5b8929b49130D'],
  5: ['0x40A2aCCbd92BCA938b02010E17A5b8929b49130D'],
  100: ['0x40A2aCCbd92BCA938b02010E17A5b8929b49130D'],
  137: ['0x40A2aCCbd92BCA938b02010E17A5b8929b49130D'],
  31337: ['0x9d4454B023096f34B160D6B654540c56A1F81688'],
};

// TODO: duplicate, remove once tested
export const rpcUrl = {
  1: process.env.NEXT_PUBLIC_MAINNET_URL,
  5: process.env.NEXT_PUBLIC_GOERLI_URL,
  31337: 'http://localhost:8545',
};
