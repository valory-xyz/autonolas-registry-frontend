export const MECH_MINTER_ADDRESS = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';

export const MECH_MINTER_CONTRACT = {
  _format: 'hh-sol-artifact-1',
  contractName: 'RegistriesManager',
  sourceName: 'contracts/RegistriesManager.sol',
  abi: [
    {
      inputs: [
        {
          internalType: 'address',
          name: '_componentRegistry',
          type: 'address',
        },
        {
          internalType: 'address',
          name: '_agentRegistry',
          type: 'address',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'previousOwner',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'newOwner',
          type: 'address',
        },
      ],
      name: 'OwnershipTransferred',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
      ],
      name: 'Paused',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
      ],
      name: 'Unpaused',
      type: 'event',
    },
    {
      inputs: [],
      name: 'agentRegistry',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'componentRegistry',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'developer',
          type: 'address',
        },
        {
          components: [
            {
              internalType: 'bytes32',
              name: 'hash',
              type: 'bytes32',
            },
            {
              internalType: 'uint8',
              name: 'hashFunction',
              type: 'uint8',
            },
            {
              internalType: 'uint8',
              name: 'size',
              type: 'uint8',
            },
          ],
          internalType: 'struct IMultihash.Multihash',
          name: 'agentHash',
          type: 'tuple',
        },
        {
          internalType: 'string',
          name: 'description',
          type: 'string',
        },
        {
          internalType: 'uint256[]',
          name: 'dependencies',
          type: 'uint256[]',
        },
      ],
      name: 'mintAgent',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'developer',
          type: 'address',
        },
        {
          components: [
            {
              internalType: 'bytes32',
              name: 'hash',
              type: 'bytes32',
            },
            {
              internalType: 'uint8',
              name: 'hashFunction',
              type: 'uint8',
            },
            {
              internalType: 'uint8',
              name: 'size',
              type: 'uint8',
            },
          ],
          internalType: 'struct IMultihash.Multihash',
          name: 'componentHash',
          type: 'tuple',
        },
        {
          internalType: 'string',
          name: 'description',
          type: 'string',
        },
        {
          internalType: 'uint256[]',
          name: 'dependencies',
          type: 'uint256[]',
        },
      ],
      name: 'mintComponent',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'owner',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'paused',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'renounceOwnership',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'newOwner',
          type: 'address',
        },
      ],
      name: 'transferOwnership',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ],
  bytecode: '',
  deployedBytecode: '',
  linkReferences: {},
  deployedLinkReferences: {},
};
