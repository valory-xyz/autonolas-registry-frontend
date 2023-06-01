export const OPERATOR_WHITELIST_CONTRACT = {
  _format: 'hh-sol-artifact-1',
  contractName: 'OperatorWhitelist',
  sourceName: 'contracts/utils/OperatorWhitelist.sol',
  abi: [
    {
      inputs: [
        {
          internalType: 'address',
          name: '_serviceRegistry',
          type: 'address',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'sender',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
      ],
      name: 'OwnerOnly',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'numValues1',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'numValues2',
          type: 'uint256',
        },
      ],
      name: 'WrongArrayLength',
      type: 'error',
    },
    {
      inputs: [],
      name: 'ZeroAddress',
      type: 'error',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'serviceOwner',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'uint256',
          name: 'serviceId',
          type: 'uint256',
        },
      ],
      name: 'OperatorsWhitelistCheckSet',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'serviceOwner',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'uint256',
          name: 'serviceId',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'address[]',
          name: 'operators',
          type: 'address[]',
        },
        {
          indexed: false,
          internalType: 'bool[]',
          name: 'statuses',
          type: 'bool[]',
        },
        {
          indexed: false,
          internalType: 'bool',
          name: 'setCheck',
          type: 'bool',
        },
      ],
      name: 'OperatorsWhitelistUpdated',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'serviceOwner',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'uint256',
          name: 'serviceId',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'bool',
          name: 'setCheck',
          type: 'bool',
        },
      ],
      name: 'SetOperatorsCheck',
      type: 'event',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'serviceId',
          type: 'uint256',
        },
        {
          internalType: 'address',
          name: 'operator',
          type: 'address',
        },
      ],
      name: 'isOperatorWhitelisted',
      outputs: [
        {
          internalType: 'bool',
          name: 'status',
          type: 'bool',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      name: 'mapServiceIdOperators',
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
      inputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      name: 'mapServiceIdOperatorsCheck',
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
      name: 'serviceRegistry',
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
          internalType: 'uint256',
          name: 'serviceId',
          type: 'uint256',
        },
        {
          internalType: 'bool',
          name: 'setCheck',
          type: 'bool',
        },
      ],
      name: 'setOperatorsCheck',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'serviceId',
          type: 'uint256',
        },
        {
          internalType: 'address[]',
          name: 'operators',
          type: 'address[]',
        },
        {
          internalType: 'bool[]',
          name: 'statuses',
          type: 'bool[]',
        },
        {
          internalType: 'bool',
          name: 'setCheck',
          type: 'bool',
        },
      ],
      name: 'setOperatorsStatuses',
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
