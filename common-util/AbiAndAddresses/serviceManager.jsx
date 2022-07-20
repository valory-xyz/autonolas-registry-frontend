export const SERVICE_MANAGER_ADDRESS = '0x9A676e781A523b5d0C0e43731313A708CB607508';

export const SERVICE_MANAGER = {
  _format: 'hh-sol-artifact-1',
  contractName: 'ServiceManager',
  sourceName: 'contracts/ServiceManager.sol',
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
          name: 'operator',
          type: 'address',
        },
      ],
      name: 'AgentInstanceRegistered',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'serviceId',
          type: 'uint256',
        },
      ],
      name: 'AgentInstancesSlotsFilled',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'agentId',
          type: 'uint256',
        },
      ],
      name: 'AgentNotFound',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'agentId',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'serviceId',
          type: 'uint256',
        },
      ],
      name: 'AgentNotInService',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'componentId',
          type: 'uint256',
        },
      ],
      name: 'ComponentNotFound',
      type: 'error',
    },
    {
      inputs: [],
      name: 'HashExists',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'sent',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'expected',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'serviceId',
          type: 'uint256',
        },
      ],
      name: 'IncorrectAgentBondingValue',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'sent',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'expected',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'serviceId',
          type: 'uint256',
        },
      ],
      name: 'IncorrectRegistrationDepositValue',
      type: 'error',
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
          name: 'manager',
          type: 'address',
        },
      ],
      name: 'ManagerOnly',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'provided',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'expected',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'serviceId',
          type: 'uint256',
        },
      ],
      name: 'OnlyOwnServiceMultisig',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'operator',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'serviceId',
          type: 'uint256',
        },
      ],
      name: 'OperatorHasNoInstances',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'provided',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'max',
          type: 'uint256',
        },
      ],
      name: 'Overflow',
      type: 'error',
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
      inputs: [],
      name: 'Paused',
      type: 'error',
    },
    {
      inputs: [],
      name: 'ReentrancyGuard',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'serviceId',
          type: 'uint256',
        },
      ],
      name: 'ServiceMustBeInactive',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'token',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'from',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'to',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'value',
          type: 'uint256',
        },
      ],
      name: 'TransferFailed',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'multisig',
          type: 'address',
        },
      ],
      name: 'UnauthorizedMultisig',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'agentId',
          type: 'uint256',
        },
      ],
      name: 'WrongAgentId',
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
      inputs: [
        {
          internalType: 'uint256',
          name: 'serviceId',
          type: 'uint256',
        },
      ],
      name: 'WrongOperator',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'state',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'serviceId',
          type: 'uint256',
        },
      ],
      name: 'WrongServiceState',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'currentThreshold',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'minThreshold',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'maxThreshold',
          type: 'uint256',
        },
      ],
      name: 'WrongThreshold',
      type: 'error',
    },
    {
      inputs: [],
      name: 'ZeroAddress',
      type: 'error',
    },
    {
      inputs: [],
      name: 'ZeroValue',
      type: 'error',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'multisig',
          type: 'address',
        },
      ],
      name: 'CreateMultisig',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
      ],
      name: 'OwnerUpdated',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
      ],
      name: 'Pause',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
      ],
      name: 'Unpause',
      type: 'event',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'serviceId',
          type: 'uint256',
        },
      ],
      name: 'activateRegistration',
      outputs: [
        {
          internalType: 'bool',
          name: 'success',
          type: 'bool',
        },
      ],
      stateMutability: 'payable',
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
      name: 'changeOwner',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'serviceOwner',
          type: 'address',
        },
        {
          internalType: 'bytes32',
          name: 'configHash',
          type: 'bytes32',
        },
        {
          internalType: 'uint32[]',
          name: 'agentIds',
          type: 'uint32[]',
        },
        {
          components: [
            {
              internalType: 'uint32',
              name: 'slots',
              type: 'uint32',
            },
            {
              internalType: 'uint96',
              name: 'bond',
              type: 'uint96',
            },
          ],
          internalType: 'struct IService.AgentParams[]',
          name: 'agentParams',
          type: 'tuple[]',
        },
        {
          internalType: 'uint32',
          name: 'threshold',
          type: 'uint32',
        },
      ],
      name: 'create',
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
          internalType: 'uint256',
          name: 'serviceId',
          type: 'uint256',
        },
        {
          internalType: 'address',
          name: 'multisigImplementation',
          type: 'address',
        },
        {
          internalType: 'bytes',
          name: 'data',
          type: 'bytes',
        },
      ],
      name: 'deploy',
      outputs: [
        {
          internalType: 'address',
          name: 'multisig',
          type: 'address',
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
      name: 'pause',
      outputs: [],
      stateMutability: 'nonpayable',
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
      inputs: [
        {
          internalType: 'uint256',
          name: 'serviceId',
          type: 'uint256',
        },
        {
          internalType: 'address[]',
          name: 'agentInstances',
          type: 'address[]',
        },
        {
          internalType: 'uint32[]',
          name: 'agentIds',
          type: 'uint32[]',
        },
      ],
      name: 'registerAgents',
      outputs: [
        {
          internalType: 'bool',
          name: 'success',
          type: 'bool',
        },
      ],
      stateMutability: 'payable',
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
      ],
      name: 'terminate',
      outputs: [
        {
          internalType: 'bool',
          name: 'success',
          type: 'bool',
        },
        {
          internalType: 'uint256',
          name: 'refund',
          type: 'uint256',
        },
      ],
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
      ],
      name: 'unbond',
      outputs: [
        {
          internalType: 'bool',
          name: 'success',
          type: 'bool',
        },
        {
          internalType: 'uint256',
          name: 'refund',
          type: 'uint256',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'unpause',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: 'configHash',
          type: 'bytes32',
        },
        {
          internalType: 'uint32[]',
          name: 'agentIds',
          type: 'uint32[]',
        },
        {
          components: [
            {
              internalType: 'uint32',
              name: 'slots',
              type: 'uint32',
            },
            {
              internalType: 'uint96',
              name: 'bond',
              type: 'uint96',
            },
          ],
          internalType: 'struct IService.AgentParams[]',
          name: 'agentParams',
          type: 'tuple[]',
        },
        {
          internalType: 'uint32',
          name: 'threshold',
          type: 'uint32',
        },
        {
          internalType: 'uint256',
          name: 'serviceId',
          type: 'uint256',
        },
      ],
      name: 'update',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ],
  bytecode: '',
  deployedBytecode: '',
  linkReferences: {},
  deployedLinkReferences: {},
};
