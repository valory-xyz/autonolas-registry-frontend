export const SERVICE_REGISTRY_ADDRESS = '0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0';

export const SERVICE_REGISTRY = {
  _format: 'hh-sol-artifact-1',
  contractName: 'ServiceRegistry',
  sourceName: 'contracts/ServiceRegistry.sol',
  abi: [
    {
      inputs: [
        {
          internalType: 'address',
          name: '_agentRegistry',
          type: 'address',
        },
        {
          internalType: 'address payable',
          name: '_gnosisSafeL2',
          type: 'address',
        },
        {
          internalType: 'address',
          name: '_gnosisSafeProxyFactory',
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
          name: 'owner',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'deadline',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'serviceId',
          type: 'uint256',
        },
      ],
      name: 'ActivateRegistration',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'uint256',
          name: 'serviceId',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'address[]',
          name: 'agentInstances',
          type: 'address[]',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'threshold',
          type: 'uint256',
        },
      ],
      name: 'CreateSafeWithAgents',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'string',
          name: 'name',
          type: 'string',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'threshold',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'serviceId',
          type: 'uint256',
        },
      ],
      name: 'CreateService',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'serviceId',
          type: 'uint256',
        },
      ],
      name: 'DeactivateRegistration',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: 'sender',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
      ],
      name: 'Deposit',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'serviceId',
          type: 'uint256',
        },
      ],
      name: 'DestroyService',
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
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: 'operator',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'serviceId',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'agent',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'agentId',
          type: 'uint256',
        },
      ],
      name: 'RegisterInstance',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'string',
          name: 'name',
          type: 'string',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'threshold',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'serviceId',
          type: 'uint256',
        },
      ],
      name: 'UpdateService',
      type: 'event',
    },
    {
      stateMutability: 'payable',
      type: 'fallback',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
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
      name: 'activateRegistration',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
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
      inputs: [
        {
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
      ],
      name: 'balanceOf',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'newManager',
          type: 'address',
        },
      ],
      name: 'changeManager',
      outputs: [],
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
      name: 'createSafe',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
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
      name: 'createService',
      outputs: [
        {
          internalType: 'uint256',
          name: 'serviceId',
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
          internalType: 'uint256',
          name: 'serviceId',
          type: 'uint256',
        },
      ],
      name: 'deactivateRegistration',
      outputs: [],
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
          internalType: 'uint256',
          name: 'serviceId',
          type: 'uint256',
        },
      ],
      name: 'destroy',
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
      name: 'exists',
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
      ],
      name: 'getConfigHashes',
      outputs: [
        {
          internalType: 'uint256',
          name: 'numHashes',
          type: 'uint256',
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
          internalType: 'struct IStructs.Multihash[]',
          name: 'configHashes',
          type: 'tuple[]',
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
          name: 'agentId',
          type: 'uint256',
        },
      ],
      name: 'getInstancesForAgentId',
      outputs: [
        {
          internalType: 'uint256',
          name: 'numAgentInstances',
          type: 'uint256',
        },
        {
          internalType: 'address[]',
          name: 'agentInstances',
          type: 'address[]',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'getMinRegistrationDeadline',
      outputs: [
        {
          internalType: 'uint256',
          name: 'minDeadline',
          type: 'uint256',
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
      name: 'getRegistrationDeadline',
      outputs: [
        {
          internalType: 'uint256',
          name: 'registrationDeadline',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'agentId',
          type: 'uint256',
        },
      ],
      name: 'getServiceIdsCreatedWithAgentId',
      outputs: [
        {
          internalType: 'uint256',
          name: 'numServiceIds',
          type: 'uint256',
        },
        {
          internalType: 'uint256[]',
          name: 'serviceIds',
          type: 'uint256[]',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'componentId',
          type: 'uint256',
        },
      ],
      name: 'getServiceIdsCreatedWithComponentId',
      outputs: [
        {
          internalType: 'uint256',
          name: 'numServiceIds',
          type: 'uint256',
        },
        {
          internalType: 'uint256[]',
          name: 'serviceIds',
          type: 'uint256[]',
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
      ],
      name: 'getServiceIdsOfOwner',
      outputs: [
        {
          internalType: 'uint256[]',
          name: '',
          type: 'uint256[]',
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
      name: 'getServiceInfo',
      outputs: [
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
          internalType: 'uint256',
          name: 'threshold',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'numAgentIds',
          type: 'uint256',
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
          name: 'numAgentInstances',
          type: 'uint256',
        },
        {
          internalType: 'address[]',
          name: 'agentInstances',
          type: 'address[]',
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
      name: 'getServiceState',
      outputs: [
        {
          internalType: 'enum ServiceRegistry.ServiceState',
          name: 'state',
          type: 'uint8',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'gnosisSafeL2',
      outputs: [
        {
          internalType: 'address payable',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'gnosisSafeProxyFactory',
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
          name: '',
          type: 'address',
        },
      ],
      name: 'mapOperatorsBalances',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
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
      inputs: [
        {
          internalType: 'uint256',
          name: 'serviceId',
          type: 'uint256',
        },
      ],
      name: 'ownerOf',
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
          name: 'operator',
          type: 'address',
        },
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
      name: 'registerAgent',
      outputs: [],
      stateMutability: 'payable',
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
          name: 'owner',
          type: 'address',
        },
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
      name: 'setRegistrationDeadline',
      outputs: [],
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
          internalType: 'uint256',
          name: 'serviceId',
          type: 'uint256',
        },
      ],
      name: 'terminate',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'totalSupply',
      outputs: [
        {
          internalType: 'uint256',
          name: 'actualNumServices',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'maxServiceId',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
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
      name: 'unbond',
      outputs: [],
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
      name: 'update',
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
