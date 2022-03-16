export const SERVICE_MANAGER_ADDRESS = '0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82';

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
          internalType: 'uint256',
          name: 'serviceId',
          type: 'uint256',
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
          name: 'actual',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'maxNumAgentInstances',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'serviceId',
          type: 'uint256',
        },
      ],
      name: 'AgentInstancesSlotsNotFilled',
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
      name: 'EmptyString',
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
      name: 'IncorrectRegistrationDepositValue',
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
          name: 'agentId',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'serviceId',
          type: 'uint256',
        },
      ],
      name: 'InsufficientAgentBondingValue',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'addr',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'deadline',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'curTime',
          type: 'uint256',
        },
      ],
      name: 'LockExpired',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'addr',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'deadline',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'curTime',
          type: 'uint256',
        },
      ],
      name: 'LockNotExpired',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'addr',
          type: 'address',
        },
        {
          internalType: 'int128',
          name: 'amount',
          type: 'int128',
        },
      ],
      name: 'LockedValueNotZero',
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
          name: 'addr',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'maxUnlockTime',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'providedUnlockTime',
          type: 'uint256',
        },
      ],
      name: 'MaxUnlockTimeReached',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'addr',
          type: 'address',
        },
      ],
      name: 'NoValueLocked',
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
          name: 'deadline',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'prevDeadline',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'serviceId',
          type: 'uint256',
        },
      ],
      name: 'RegistrationDeadlineChangeRedundant',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'deadline',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'minBlock',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'serviceId',
          type: 'uint256',
        },
      ],
      name: 'RegistrationDeadlineIncorrect',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'deadline',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'curBlock',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'serviceId',
          type: 'uint256',
        },
      ],
      name: 'RegistrationTimeout',
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
      name: 'ServiceDoesNotExist',
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
      name: 'ServiceMustBeActive',
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
          internalType: 'uint256',
          name: 'serviceId',
          type: 'uint256',
        },
      ],
      name: 'ServiceNotFound',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'teminationBlock',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'curBlock',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'serviceId',
          type: 'uint256',
        },
      ],
      name: 'ServiceTerminated',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'terminationBlock',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'curBlock',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'serviceId',
          type: 'uint256',
        },
      ],
      name: 'TerminationBlockIncorrect',
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
          name: 'addr',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'minUnlockTime',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'providedUnlockTime',
          type: 'uint256',
        },
      ],
      name: 'UnlockTimeIncorrect',
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
          name: 'numAgentIds',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'numAgentSlots',
          type: 'uint256',
        },
      ],
      name: 'WrongAgentIdsData',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'providedBlockNumber',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'actualBlockNumber',
          type: 'uint256',
        },
      ],
      name: 'WrongBlockNumber',
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
      name: 'WrongComponentId',
      type: 'error',
    },
    {
      inputs: [],
      name: 'WrongFunction',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'uint8',
          name: 'hashFunctionProvided',
          type: 'uint8',
        },
        {
          internalType: 'uint8',
          name: 'hashFunctionNeeded',
          type: 'uint8',
        },
        {
          internalType: 'uint8',
          name: 'sizeProvided',
          type: 'uint8',
        },
        {
          internalType: 'uint8',
          name: 'sizeNeeded',
          type: 'uint8',
        },
      ],
      name: 'WrongHash',
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
          indexed: false,
          internalType: 'address',
          name: 'multisig',
          type: 'address',
        },
      ],
      name: 'GnosisSafeCreate',
      type: 'event',
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
      stateMutability: 'payable',
      type: 'fallback',
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
      name: 'renounceOwnership',
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
          internalType: 'uint256',
          name: 'deadline',
          type: 'uint256',
        },
      ],
      name: 'serviceActivateRegistration',
      outputs: [],
      stateMutability: 'payable',
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
          internalType: 'string',
          name: 'name',
          type: 'string',
        },
        {
          internalType: 'string',
          name: 'description',
          type: 'string',
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
          internalType: 'struct IStructs.Multihash',
          name: 'configHash',
          type: 'tuple',
        },
        {
          internalType: 'uint256[]',
          name: 'agentIds',
          type: 'uint256[]',
        },
        {
          components: [
            {
              internalType: 'uint256',
              name: 'slots',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'bond',
              type: 'uint256',
            },
          ],
          internalType: 'struct IStructs.AgentParams[]',
          name: 'agentParams',
          type: 'tuple[]',
        },
        {
          internalType: 'uint256',
          name: 'threshold',
          type: 'uint256',
        },
      ],
      name: 'serviceCreate',
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
          name: 'to',
          type: 'address',
        },
        {
          internalType: 'bytes',
          name: 'data',
          type: 'bytes',
        },
        {
          internalType: 'address',
          name: 'fallbackHandler',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'paymentToken',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'payment',
          type: 'uint256',
        },
        {
          internalType: 'address payable',
          name: 'paymentReceiver',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'nonce',
          type: 'uint256',
        },
      ],
      name: 'serviceCreateSafe',
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
      inputs: [
        {
          internalType: 'uint256',
          name: 'serviceId',
          type: 'uint256',
        },
      ],
      name: 'serviceDestroy',
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
          internalType: 'address',
          name: 'agent',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'agentId',
          type: 'uint256',
        },
      ],
      name: 'serviceRegisterAgent',
      outputs: [],
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
        {
          internalType: 'uint256',
          name: 'deadline',
          type: 'uint256',
        },
      ],
      name: 'serviceSetRegistrationDeadline',
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
      ],
      name: 'serviceTerminate',
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
      ],
      name: 'serviceUnbond',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'string',
          name: 'name',
          type: 'string',
        },
        {
          internalType: 'string',
          name: 'description',
          type: 'string',
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
          internalType: 'struct IStructs.Multihash',
          name: 'configHash',
          type: 'tuple',
        },
        {
          internalType: 'uint256[]',
          name: 'agentIds',
          type: 'uint256[]',
        },
        {
          components: [
            {
              internalType: 'uint256',
              name: 'slots',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'bond',
              type: 'uint256',
            },
          ],
          internalType: 'struct IStructs.AgentParams[]',
          name: 'agentParams',
          type: 'tuple[]',
        },
        {
          internalType: 'uint256',
          name: 'threshold',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'serviceId',
          type: 'uint256',
        },
      ],
      name: 'serviceUpdate',
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
    {
      stateMutability: 'payable',
      type: 'receive',
    },
  ],
  bytecode: '',
  deployedBytecode: '',
  linkReferences: {},
  deployedLinkReferences: {},
};
