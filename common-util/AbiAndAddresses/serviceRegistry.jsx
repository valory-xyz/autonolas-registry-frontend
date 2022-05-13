export const SERVICE_REGISTRY_ADDRESS = '0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0';

export const SERVICE_REGISTRY = {
  _format: 'hh-sol-artifact-1',
  contractName: 'ServiceRegistry',
  sourceName: 'contracts/registries/ServiceRegistry.sol',
  abi: [
    {
      inputs: [
        {
          internalType: 'string',
          name: '_name',
          type: 'string',
        },
        {
          internalType: 'string',
          name: '_symbol',
          type: 'string',
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
          name: 'provided',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'expected',
          type: 'uint256',
        },
      ],
      name: 'AmountLowerThan',
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
          internalType: 'uint256',
          name: 'provided',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'expected',
          type: 'uint256',
        },
      ],
      name: 'InsufficientAllowance',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'account',
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
          name: 'account',
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
          name: 'account',
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
          name: 'account',
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
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
      ],
      name: 'MintRejectedByInflationPolicy',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'account',
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
          name: 'account',
          type: 'address',
        },
      ],
      name: 'NonTransferrable',
      type: 'error',
    },
    {
      inputs: [],
      name: 'NonZeroValue',
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
          name: 'tokenAddress',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'productId',
          type: 'uint256',
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
      name: 'ProductExpired',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'tokenAddress',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'productId',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'requested',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'actual',
          type: 'uint256',
        },
      ],
      name: 'ProductSupplyLow',
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
          name: 'account',
          type: 'address',
        },
      ],
      name: 'UnauthorizedAccount',
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
          internalType: 'address',
          name: 'tokenAddress',
          type: 'address',
        },
      ],
      name: 'UnauthorizedToken',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'account',
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
          name: 'provided',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'expected',
          type: 'uint256',
        },
      ],
      name: 'WrongAmount',
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
      ],
      name: 'WrongTokenAddress',
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
          indexed: true,
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'approved',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'uint256',
          name: 'tokenId',
          type: 'uint256',
        },
      ],
      name: 'Approval',
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
        {
          indexed: true,
          internalType: 'address',
          name: 'operator',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'bool',
          name: 'approved',
          type: 'bool',
        },
      ],
      name: 'ApprovalForAll',
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
          internalType: 'address',
          name: 'multisig',
          type: 'address',
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
      name: 'CreateMultisigWithAgents',
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
      name: 'DeployService',
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
          indexed: false,
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
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
      ],
      name: 'OperatorSlashed',
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
      ],
      name: 'OperatorUnbond',
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
          name: 'sendee',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
      ],
      name: 'Refund',
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
          name: 'manager',
          type: 'address',
        },
      ],
      name: 'ServiceRegistryManagerUpdated',
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
      name: 'TerminateService',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'from',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'to',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'uint256',
          name: 'tokenId',
          type: 'uint256',
        },
      ],
      name: 'Transfer',
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
          name: 'to',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'tokenId',
          type: 'uint256',
        },
      ],
      name: 'approve',
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
          name: 'multisig',
          type: 'address',
        },
        {
          internalType: 'bool',
          name: 'permission',
          type: 'bool',
        },
      ],
      name: 'changeMultisigPermission',
      outputs: [
        {
          internalType: 'bool',
          name: 'success',
          type: 'bool',
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
      outputs: [
        {
          internalType: 'bool',
          name: 'success',
          type: 'bool',
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
      name: 'getAgentIdsOfServiceId',
      outputs: [
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
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'tokenId',
          type: 'uint256',
        },
      ],
      name: 'getApproved',
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
      name: 'getComponentIdsOfServiceId',
      outputs: [
        {
          internalType: 'uint256',
          name: 'numComponentIds',
          type: 'uint256',
        },
        {
          internalType: 'uint256[]',
          name: 'componentIds',
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
      name: 'getOperatorBalance',
      outputs: [
        {
          internalType: 'uint256',
          name: 'balance',
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
        {
          internalType: 'address',
          name: 'multisig',
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
      inputs: [
        {
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'operator',
          type: 'address',
        },
      ],
      name: 'isApprovedForAll',
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
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      name: 'mapMultisigs',
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
      name: 'name',
      outputs: [
        {
          internalType: 'string',
          name: '',
          type: 'string',
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
          name: 'tokenId',
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
          internalType: 'address[]',
          name: 'agentInstances',
          type: 'address[]',
        },
        {
          internalType: 'uint256[]',
          name: 'agentIds',
          type: 'uint256[]',
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
      name: 'renounceOwnership',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
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
          name: 'tokenId',
          type: 'uint256',
        },
      ],
      name: 'safeTransferFrom',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
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
          name: 'tokenId',
          type: 'uint256',
        },
        {
          internalType: 'bytes',
          name: '_data',
          type: 'bytes',
        },
      ],
      name: 'safeTransferFrom',
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
          internalType: 'bool',
          name: 'approved',
          type: 'bool',
        },
      ],
      name: 'setApprovalForAll',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address[]',
          name: 'agentInstances',
          type: 'address[]',
        },
        {
          internalType: 'uint256[]',
          name: 'amounts',
          type: 'uint256[]',
        },
        {
          internalType: 'uint256',
          name: 'serviceId',
          type: 'uint256',
        },
      ],
      name: 'slash',
      outputs: [
        {
          internalType: 'bool',
          name: 'success',
          type: 'bool',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'slashedFunds',
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
          internalType: 'bytes4',
          name: 'interfaceId',
          type: 'bytes4',
        },
      ],
      name: 'supportsInterface',
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
      name: 'symbol',
      outputs: [
        {
          internalType: 'string',
          name: '',
          type: 'string',
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
          name: 'index',
          type: 'uint256',
        },
      ],
      name: 'tokenByIndex',
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
          name: 'owner',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'index',
          type: 'uint256',
        },
      ],
      name: 'tokenOfOwnerByIndex',
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
          internalType: 'uint256',
          name: 'tokenId',
          type: 'uint256',
        },
      ],
      name: 'tokenURI',
      outputs: [
        {
          internalType: 'string',
          name: '',
          type: 'string',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'totalSupply',
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
          name: 'tokenId',
          type: 'uint256',
        },
      ],
      name: 'transferFrom',
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
      outputs: [
        {
          internalType: 'bool',
          name: 'success',
          type: 'bool',
        },
      ],
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
