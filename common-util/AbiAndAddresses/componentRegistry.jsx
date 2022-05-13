export const COMPONENT_REGISTRY_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

export const COMPONENT_REGISTRY = {
  _format: 'hh-sol-artifact-1',
  contractName: 'ComponentRegistry',
  sourceName: 'contracts/registries/ComponentRegistry.sol',
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
          internalType: 'string',
          name: '_bURI',
          type: 'string',
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
      inputs: [],
      name: '_BASEURI',
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
          internalType: 'struct IStructs.Multihash',
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
          name: 'tokenId',
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
      inputs: [],
      name: 'getBaseURI',
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
          internalType: 'uint256',
          name: 'tokenId',
          type: 'uint256',
        },
      ],
      name: 'getDependencies',
      outputs: [
        {
          internalType: 'uint256',
          name: 'numDependencies',
          type: 'uint256',
        },
        {
          internalType: 'uint256[]',
          name: 'dependencies',
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
      name: 'getHashes',
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
          name: 'componentHashes',
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
          name: 'tokenId',
          type: 'uint256',
        },
      ],
      name: 'getInfo',
      outputs: [
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
          internalType: 'struct IStructs.Multihash',
          name: 'componentHash',
          type: 'tuple',
        },
        {
          internalType: 'string',
          name: 'description',
          type: 'string',
        },
        {
          internalType: 'uint256',
          name: 'numDependencies',
          type: 'uint256',
        },
        {
          internalType: 'uint256[]',
          name: 'dependencies',
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
          internalType: 'string',
          name: 'bURI',
          type: 'string',
        },
      ],
      name: 'setBaseURI',
      outputs: [],
      stateMutability: 'nonpayable',
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
          name: 'owner',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'tokenId',
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
          internalType: 'struct IStructs.Multihash',
          name: 'componentHash',
          type: 'tuple',
        },
      ],
      name: 'updateHash',
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
  ],
  bytecode: '',
  deployedBytecode: '',
  linkReferences: {},
  deployedLinkReferences: {},
};
