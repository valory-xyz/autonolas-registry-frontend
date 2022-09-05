export const GNOSIS_SAFE_CONTRACT = {
  _format: 'hh-sol-artifact-1',
  contractName: 'GnosisSafe',
  sourceName: '@gnosis.pm/safe-contracts/contracts/GnosisSafe.sol',
  abi: [
    {
      inputs: [],
      stateMutability: 'nonpayable',
      type: 'constructor',
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
      ],
      name: 'AddedOwner',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'approvedHash',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
      ],
      name: 'ApproveHash',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: 'handler',
          type: 'address',
        },
      ],
      name: 'ChangedFallbackHandler',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: 'guard',
          type: 'address',
        },
      ],
      name: 'ChangedGuard',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'uint256',
          name: 'threshold',
          type: 'uint256',
        },
      ],
      name: 'ChangedThreshold',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: 'module',
          type: 'address',
        },
      ],
      name: 'DisabledModule',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: 'module',
          type: 'address',
        },
      ],
      name: 'EnabledModule',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'bytes32',
          name: 'txHash',
          type: 'bytes32',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'payment',
          type: 'uint256',
        },
      ],
      name: 'ExecutionFailure',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'module',
          type: 'address',
        },
      ],
      name: 'ExecutionFromModuleFailure',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'module',
          type: 'address',
        },
      ],
      name: 'ExecutionFromModuleSuccess',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'bytes32',
          name: 'txHash',
          type: 'bytes32',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'payment',
          type: 'uint256',
        },
      ],
      name: 'ExecutionSuccess',
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
      ],
      name: 'RemovedOwner',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'sender',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'value',
          type: 'uint256',
        },
      ],
      name: 'SafeReceived',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'initiator',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'address[]',
          name: 'owners',
          type: 'address[]',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'threshold',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'initializer',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'fallbackHandler',
          type: 'address',
        },
      ],
      name: 'SafeSetup',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'msgHash',
          type: 'bytes32',
        },
      ],
      name: 'SignMsg',
      type: 'event',
    },
    {
      stateMutability: 'nonpayable',
      type: 'fallback',
    },
    {
      inputs: [],
      name: 'VERSION',
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
          name: '_threshold',
          type: 'uint256',
        },
      ],
      name: 'addOwnerWithThreshold',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: 'hashToApprove',
          type: 'bytes32',
        },
      ],
      name: 'approveHash',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
        {
          internalType: 'bytes32',
          name: '',
          type: 'bytes32',
        },
      ],
      name: 'approvedHashes',
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
          name: '_threshold',
          type: 'uint256',
        },
      ],
      name: 'changeThreshold',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: 'dataHash',
          type: 'bytes32',
        },
        {
          internalType: 'bytes',
          name: 'data',
          type: 'bytes',
        },
        {
          internalType: 'bytes',
          name: 'signatures',
          type: 'bytes',
        },
        {
          internalType: 'uint256',
          name: 'requiredSignatures',
          type: 'uint256',
        },
      ],
      name: 'checkNSignatures',
      outputs: [],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: 'dataHash',
          type: 'bytes32',
        },
        {
          internalType: 'bytes',
          name: 'data',
          type: 'bytes',
        },
        {
          internalType: 'bytes',
          name: 'signatures',
          type: 'bytes',
        },
      ],
      name: 'checkSignatures',
      outputs: [],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'prevModule',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'module',
          type: 'address',
        },
      ],
      name: 'disableModule',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'domainSeparator',
      outputs: [
        {
          internalType: 'bytes32',
          name: '',
          type: 'bytes32',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'module',
          type: 'address',
        },
      ],
      name: 'enableModule',
      outputs: [],
      stateMutability: 'nonpayable',
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
          name: 'value',
          type: 'uint256',
        },
        {
          internalType: 'bytes',
          name: 'data',
          type: 'bytes',
        },
        {
          internalType: 'enum Enum.Operation',
          name: 'operation',
          type: 'uint8',
        },
        {
          internalType: 'uint256',
          name: 'safeTxGas',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'baseGas',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'gasPrice',
          type: 'uint256',
        },
        {
          internalType: 'address',
          name: 'gasToken',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'refundReceiver',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: '_nonce',
          type: 'uint256',
        },
      ],
      name: 'encodeTransactionData',
      outputs: [
        {
          internalType: 'bytes',
          name: '',
          type: 'bytes',
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
          name: 'value',
          type: 'uint256',
        },
        {
          internalType: 'bytes',
          name: 'data',
          type: 'bytes',
        },
        {
          internalType: 'enum Enum.Operation',
          name: 'operation',
          type: 'uint8',
        },
        {
          internalType: 'uint256',
          name: 'safeTxGas',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'baseGas',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'gasPrice',
          type: 'uint256',
        },
        {
          internalType: 'address',
          name: 'gasToken',
          type: 'address',
        },
        {
          internalType: 'address payable',
          name: 'refundReceiver',
          type: 'address',
        },
        {
          internalType: 'bytes',
          name: 'signatures',
          type: 'bytes',
        },
      ],
      name: 'execTransaction',
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
          name: 'to',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'value',
          type: 'uint256',
        },
        {
          internalType: 'bytes',
          name: 'data',
          type: 'bytes',
        },
        {
          internalType: 'enum Enum.Operation',
          name: 'operation',
          type: 'uint8',
        },
      ],
      name: 'execTransactionFromModule',
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
          name: 'to',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'value',
          type: 'uint256',
        },
        {
          internalType: 'bytes',
          name: 'data',
          type: 'bytes',
        },
        {
          internalType: 'enum Enum.Operation',
          name: 'operation',
          type: 'uint8',
        },
      ],
      name: 'execTransactionFromModuleReturnData',
      outputs: [
        {
          internalType: 'bool',
          name: 'success',
          type: 'bool',
        },
        {
          internalType: 'bytes',
          name: 'returnData',
          type: 'bytes',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'getChainId',
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
          name: 'start',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'pageSize',
          type: 'uint256',
        },
      ],
      name: 'getModulesPaginated',
      outputs: [
        {
          internalType: 'address[]',
          name: 'array',
          type: 'address[]',
        },
        {
          internalType: 'address',
          name: 'next',
          type: 'address',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'getOwners',
      outputs: [
        {
          internalType: 'address[]',
          name: '',
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
          name: 'offset',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'length',
          type: 'uint256',
        },
      ],
      name: 'getStorageAt',
      outputs: [
        {
          internalType: 'bytes',
          name: '',
          type: 'bytes',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'getThreshold',
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
          name: 'to',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'value',
          type: 'uint256',
        },
        {
          internalType: 'bytes',
          name: 'data',
          type: 'bytes',
        },
        {
          internalType: 'enum Enum.Operation',
          name: 'operation',
          type: 'uint8',
        },
        {
          internalType: 'uint256',
          name: 'safeTxGas',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'baseGas',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'gasPrice',
          type: 'uint256',
        },
        {
          internalType: 'address',
          name: 'gasToken',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'refundReceiver',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: '_nonce',
          type: 'uint256',
        },
      ],
      name: 'getTransactionHash',
      outputs: [
        {
          internalType: 'bytes32',
          name: '',
          type: 'bytes32',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'module',
          type: 'address',
        },
      ],
      name: 'isModuleEnabled',
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
          name: 'owner',
          type: 'address',
        },
      ],
      name: 'isOwner',
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
      name: 'nonce',
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
          name: 'prevOwner',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: '_threshold',
          type: 'uint256',
        },
      ],
      name: 'removeOwner',
      outputs: [],
      stateMutability: 'nonpayable',
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
          name: 'value',
          type: 'uint256',
        },
        {
          internalType: 'bytes',
          name: 'data',
          type: 'bytes',
        },
        {
          internalType: 'enum Enum.Operation',
          name: 'operation',
          type: 'uint8',
        },
      ],
      name: 'requiredTxGas',
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
          name: 'handler',
          type: 'address',
        },
      ],
      name: 'setFallbackHandler',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'guard',
          type: 'address',
        },
      ],
      name: 'setGuard',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address[]',
          name: '_owners',
          type: 'address[]',
        },
        {
          internalType: 'uint256',
          name: '_threshold',
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
      ],
      name: 'setup',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: '',
          type: 'bytes32',
        },
      ],
      name: 'signedMessages',
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
          name: 'targetContract',
          type: 'address',
        },
        {
          internalType: 'bytes',
          name: 'calldataPayload',
          type: 'bytes',
        },
      ],
      name: 'simulateAndRevert',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'prevOwner',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'oldOwner',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'newOwner',
          type: 'address',
        },
      ],
      name: 'swapOwner',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      stateMutability: 'payable',
      type: 'receive',
    },
  ],
  bytecode: '0x608060405234801561001057600080fd5b50600160045561318c806100256000396000f3fe6080604052600436106101dc5760003560e01c8063affed0e011610102578063e19a9dd911610095578063f08a032311610064578063f08a032314610620578063f698da2514610640578063f8dc5dd9146106a7578063ffa1ad74146106c757610218565b8063e19a9dd9146105ab578063e318b52b146105cb578063e75235b8146105eb578063e86637db1461060057610218565b8063cc2f8452116100d1578063cc2f84521461051d578063d4d9bdcd1461054b578063d8d11f781461056b578063e009cfde1461058b57610218565b8063affed0e0146104a7578063b4faba09146104bd578063b63e800d146104dd578063c4ca3a9c146104fd57610218565b80635624b25b1161017a5780636a761202116101495780636a7612021461041a5780637d8329741461042d578063934f3a1114610465578063a0e67e2b1461048557610218565b80635624b25b146103805780635ae6bd37146103ad578063610b5925146103da578063694e80c3146103fa57610218565b80632f54bf6e116101b65780632f54bf6e146102f55780633408e47014610315578063468721a7146103325780635229073f1461035257610218565b80630d582f131461027e57806312fb68e0146102a05780632d9ad53d146102c057610218565b366102185760405134815233907f3d0ce9bfc3ed7d6862dbb28b2dea94561fe714a1b4d019aa8af39730d1ad7c3d9060200160405180910390a2005b34801561022457600080fd5b507f6c9a6c4a39284e37ed1cf53d337577d14212a4870fb976a4366c693b939918d580548061024f57005b36600080373360601b365260008060143601600080855af190503d6000803e80610278573d6000fd5b503d6000f35b34801561028a57600080fd5b5061029e61029936600461263b565b6106f8565b005b3480156102ac57600080fd5b5061029e6102bb36600461270a565b610884565b3480156102cc57600080fd5b506102e06102db36600461277f565b610d07565b60405190151581526020015b60405180910390f35b34801561030157600080fd5b506102e061031036600461277f565b610d42565b34801561032157600080fd5b50465b6040519081526020016102ec565b34801561033e57600080fd5b506102e061034d3660046127ab565b610d7a565b34801561035e57600080fd5b5061037261036d3660046127ab565b610e51565b6040516102ec929190612862565b34801561038c57600080fd5b506103a061039b36600461287d565b610e87565b6040516102ec919061289f565b3480156103b957600080fd5b506103246103c83660046128b2565b60076020526000908152604090205481565b3480156103e657600080fd5b5061029e6103f536600461277f565b610f0d565b34801561040657600080fd5b5061029e6104153660046128b2565b61104f565b6102e0610428366004612914565b6110ff565b34801561043957600080fd5b5061032461044836600461263b565b600860209081526000928352604080842090915290825290205481565b34801561047157600080fd5b5061029e6104803660046129ed565b611448565b34801561049157600080fd5b5061049a611492565b6040516102ec9190612a9e565b3480156104b357600080fd5b5061032460055481565b3480156104c957600080fd5b5061029e6104d8366004612ab1565b611583565b3480156104e957600080fd5b5061029e6104f8366004612b01565b6115a6565b34801561050957600080fd5b50610324610518366004612bf6565b6116c7565b34801561052957600080fd5b5061053d61053836600461263b565b611761565b6040516102ec929190612c67565b34801561055757600080fd5b5061029e6105663660046128b2565b61185b565b34801561057757600080fd5b50610324610586366004612c92565b6118f0565b34801561059757600080fd5b5061029e6105a6366004612d53565b61191d565b3480156105b757600080fd5b5061029e6105c636600461277f565b611a4c565b3480156105d757600080fd5b5061029e6105e6366004612d8c565b611ab1565b3480156105f757600080fd5b50600454610324565b34801561060c57600080fd5b506103a061061b366004612c92565b611ce8565b34801561062c57600080fd5b5061029e61063b36600461277f565b611e2b565b34801561064c57600080fd5b5061032460007f47e79534a245952e8b16893a336b85a3d9ea9fa8c573f3d803afb92a794692184660408051602081019390935282015230606082015260800160405160208183030381529060405280519060200120905090565b3480156106b357600080fd5b5061029e6106c2366004612dd7565b611e94565b3480156106d357600080fd5b506103a0604051806040016040528060058152602001640312e332e360dc1b81525081565b610700612037565b6001600160a01b0382161580159061072257506001600160a01b038216600114155b801561073757506001600160a01b0382163014155b6107705760405162461bcd60e51b8152602060048201526005602482015264475332303360d81b60448201526064015b60405180910390fd5b6001600160a01b0382811660009081526002602052604090205416156107c05760405162461bcd60e51b815260206004820152600560248201526411d4cc8c0d60da1b6044820152606401610767565b60026020527fe90b7bceb6e7df5418fb78d8ee546e97c83a08bbccc01a0644d599ccd2a7c2e080546001600160a01b038481166000818152604081208054939094166001600160a01b03199384161790935560018352835490911617909155600380549161082d83612e2e565b90915550506040516001600160a01b03831681527f9465fa0c962cc76958e6373a993326400c1c94f8be2fe3a952adfa7f60b2ea269060200160405180910390a18060045414610880576108808161104f565b5050565b61088f816041612070565b825110156108c75760405162461bcd60e51b8152602060048201526005602482015264047533032360dc1b6044820152606401610767565b6000808060008060005b86811015610cfb576041818102890160208101516040820151919092015160ff16955090935091506000849003610aba579193508391610912876041612070565b8210156109495760405162461bcd60e51b8152602060048201526005602482015264475330323160d81b6044820152606401610767565b87516109568360206120ac565b111561098c5760405162461bcd60e51b815260206004820152600560248201526423a998191960d91b6044820152606401610767565b6020828901810151895190916109af9083906109a99087906120ac565b906120ac565b11156109e55760405162461bcd60e51b8152602060048201526005602482015264475330323360d81b6044820152606401610767565b6040516320c13b0b60e01b8082528a8501602001916001600160a01b038916906320c13b0b90610a1b908f908690600401612e47565b602060405180830381865afa158015610a38573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a5c9190612e6c565b7fffffffff000000000000000000000000000000000000000000000000000000001614610ab35760405162461bcd60e51b815260206004820152600560248201526411d4cc0c8d60da1b6044820152606401610767565b5050610c61565b8360ff16600103610b3c579193508391336001600160a01b0384161480610b0357506001600160a01b03851660009081526008602090815260408083208d845290915290205415155b610b375760405162461bcd60e51b8152602060048201526005602482015264475330323560d81b6044820152606401610767565b610c61565b601e8460ff161115610c01576040517f19457468657265756d205369676e6564204d6573736167653a0a3332000000006020820152603c81018b9052600190605c0160405160208183030381529060405280519060200120600486610ba19190612eae565b6040805160008152602081018083529390935260ff90911690820152606081018590526080810184905260a0016020604051602081039080840390855afa158015610bf0573d6000803e3d6000fd5b505050602060405103519450610c61565b6040805160008152602081018083528c905260ff861691810191909152606081018490526080810183905260019060a0016020604051602081039080840390855afa158015610c54573d6000803e3d6000fd5b5050506020604051035194505b856001600160a01b0316856001600160a01b0316118015610c9b57506001600160a01b038581166000908152600260205260409020541615155b8015610cb157506001600160a01b038516600114155b610ce55760405162461bcd60e51b815260206004820152600560248201526423a998191b60d91b6044820152606401610767565b8495508080610cf390612e2e565b9150506108d1565b50505050505050505050565b600060016001600160a01b03831614801590610d3c57506001600160a01b038281166000908152600160205260409020541615155b92915050565b60006001600160a01b038216600114801590610d3c5750506001600160a01b0390811660009081526002602052604090205416151590565b600033600114801590610da45750336000908152600160205260409020546001600160a01b031615155b610dd85760405162461bcd60e51b815260206004820152600560248201526411d4cc4c0d60da1b6044820152606401610767565b610de5858585855a6120c8565b90508015610e1d5760405133907f6895c13664aa4f67288b25d7a21d7aaa34916e355fb9b6fae0a139a9085becb890600090a2610e49565b60405133907facd2c8702804128fdb0db2bb49f6d127dd0181c13fd45dbfe16de0930e2bd37590600090a25b949350505050565b60006060610e6186868686610d7a565b915060405160203d0181016040523d81523d6000602083013e8091505094509492505050565b60606000610e96836020612ed1565b67ffffffffffffffff811115610eae57610eae612667565b6040519080825280601f01601f191660200182016040528015610ed8576020820181803683370190505b50905060005b83811015610f05578481015460208083028401015280610efd81612e2e565b915050610ede565b509392505050565b610f15612037565b6001600160a01b03811615801590610f3757506001600160a01b038116600114155b610f6b5760405162461bcd60e51b8152602060048201526005602482015264475331303160d81b6044820152606401610767565b6001600160a01b038181166000908152600160205260409020541615610fbb5760405162461bcd60e51b815260206004820152600560248201526423a998981960d91b6044820152606401610767565b600160208181527fcc69885fda6bcc1a4ace058b4a62bf5e179ea78fd58a1ccd71c22cc9b688792f80546001600160a01b03858116600081815260408082208054949095166001600160a01b031994851617909455959095528254168417909155519182527fecdf3a3effea5783a3c4c2140e677577666428d44ed9d474a0b3a4c9943f844091015b60405180910390a150565b611057612037565b6003548111156110915760405162461bcd60e51b8152602060048201526005602482015264475332303160d81b6044820152606401610767565b60018110156110ca5760405162461bcd60e51b815260206004820152600560248201526423a999181960d91b6044820152606401610767565b60048190556040518181527f610f7ff2b304ae8903c3de74c60c6ab1f7d6226b3f52c5161905bb5ad4039c9390602001611044565b60008060006111198e8e8e8e8e8e8e8e8e8e600554611ce8565b60058054919250600061112b83612e2e565b9091555050805160208201209150611144828286611448565b50600061116f7f4a204f620c8c5ccdca3fd54d003badd85ba500436a431f0cbda4f558c93c34c85490565b90506001600160a01b038116156111f557806001600160a01b03166375f0bb528f8f8f8f8f8f8f8f8f8f8f336040518d63ffffffff1660e01b81526004016111c29c9b9a99989796959493929190612f28565b600060405180830381600087803b1580156111dc57600080fd5b505af11580156111f0573d6000803e3d6000fd5b505050505b6112216112048a6109c4612fec565b603f6112118c6040612ed1565b61121b9190613004565b9061210f565b61122d906101f4612fec565b5a10156112645760405162461bcd60e51b8152602060048201526005602482015264047533031360dc1b6044820152606401610767565b60005a90506112d58f8f8f8f8080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050508e8c6000146112c2578e6120c8565b6109c45a6112d09190613026565b6120c8565b93506112e25a8290612126565b905083806112ef57508915155b806112f957508715155b61132d5760405162461bcd60e51b8152602060048201526005602482015264475330313360d81b6044820152606401610767565b6000881561134557611342828b8b8b8b612141565b90505b84156113895760408051858152602081018390527f442e715f626346e8c54381002da614f62bee8d27386535b2521ec8540898556e910160405180910390a16113c3565b60408051858152602081018390527f23428b18acfb3ea64b08dc0c1d296ea9c09702c09083ca5272e64d115b687d23910160405180910390a15b50506001600160a01b0381161561143757604051631264e26d60e31b81526004810183905283151560248201526001600160a01b03821690639327136890604401600060405180830381600087803b15801561141e57600080fd5b505af1158015611432573d6000803e3d6000fd5b505050505b50509b9a5050505050505050505050565b600454806114805760405162461bcd60e51b8152602060048201526005602482015264475330303160d81b6044820152606401610767565b61148c84848484610884565b50505050565b6060600060035467ffffffffffffffff8111156114b1576114b1612667565b6040519080825280602002602001820160405280156114da578160200160208202803683370190505b506001600090815260026020527fe90b7bceb6e7df5418fb78d8ee546e97c83a08bbccc01a0644d599ccd2a7c2e054919250906001600160a01b03165b6001600160a01b03811660011461157b578083838151811061153b5761153b61303d565b6001600160a01b0392831660209182029290920181019190915291811660009081526002909252604090912054168161157381612e2e565b925050611517565b509092915050565b600080825160208401855af480600052503d6020523d600060403e60403d016000fd5b6115e48a8a808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152508c9250612247915050565b6001600160a01b0384161561161b5761161b847f6c9a6c4a39284e37ed1cf53d337577d14212a4870fb976a4366c693b939918d555565b61165b8787878080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061247592505050565b81156116725761167082600060018685612141565b505b336001600160a01b03167f141df868a6331af528e38c83b7aa03edc19be66e37ae67f9285bf4f8e3c6a1a88b8b8b8b896040516116b3959493929190613053565b60405180910390a250505050505050505050565b6000805a9050611710878787878080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525089925050505a6120c8565b61171957600080fd5b60005a6117269083613026565b90508060405160200161173b91815260200190565b60408051601f198184030181529082905262461bcd60e51b82526107679160040161289f565b606060008267ffffffffffffffff81111561177e5761177e612667565b6040519080825280602002602001820160405280156117a7578160200160208202803683370190505b506001600160a01b0380861660009081526001602052604081205492945091165b6001600160a01b038116158015906117ea57506001600160a01b038116600114155b80156117f557508482105b1561184d578084838151811061180d5761180d61303d565b6001600160a01b0392831660209182029290920181019190915291811660009081526001909252604090912054168161184581612e2e565b9250506117c8565b908352919491935090915050565b336000908152600260205260409020546001600160a01b03166118a85760405162461bcd60e51b8152602060048201526005602482015264047533033360dc1b6044820152606401610767565b336000818152600860209081526040808320858452909152808220600190555183917ff2a0eb156472d1440255b0d7c1e19cc07115d1051fe605b0dce69acfec884d9c91a350565b60006119058c8c8c8c8c8c8c8c8c8c8c611ce8565b8051906020012090509b9a5050505050505050505050565b611925612037565b6001600160a01b0381161580159061194757506001600160a01b038116600114155b61197b5760405162461bcd60e51b8152602060048201526005602482015264475331303160d81b6044820152606401610767565b6001600160a01b038281166000908152600160205260409020548116908216146119cf5760405162461bcd60e51b8152602060048201526005602482015264475331303360d81b6044820152606401610767565b6001600160a01b038181166000818152600160209081526040808320805488871685528285208054919097166001600160a01b03199182161790965592849052825490941690915591519081527faab4fa2b463f581b2b32cb3b7e3b704b9ce37cc209b5fb4d77e593ace405427691015b60405180910390a15050565b611a54612037565b7f4a204f620c8c5ccdca3fd54d003badd85ba500436a431f0cbda4f558c93c34c88181556040516001600160a01b03831681527f1151116914515bc0891ff9047a6cb32cf902546f83066499bcf8ba33d2353fa290602001611a40565b611ab9612037565b6001600160a01b03811615801590611adb57506001600160a01b038116600114155b8015611af057506001600160a01b0381163014155b611b245760405162461bcd60e51b8152602060048201526005602482015264475332303360d81b6044820152606401610767565b6001600160a01b038181166000908152600260205260409020541615611b745760405162461bcd60e51b815260206004820152600560248201526411d4cc8c0d60da1b6044820152606401610767565b6001600160a01b03821615801590611b9657506001600160a01b038216600114155b611bca5760405162461bcd60e51b8152602060048201526005602482015264475332303360d81b6044820152606401610767565b6001600160a01b03838116600090815260026020526040902054811690831614611c1e5760405162461bcd60e51b8152602060048201526005602482015264475332303560d81b6044820152606401610767565b6001600160a01b038281166000818152600260209081526040808320805487871680865283862080549289166001600160a01b0319938416179055968a1685528285208054821690971790965592849052825490941690915591519081527ff8d49fc529812e9a7c5c50e69c20f0dccc0db8fa95c98bc58cc9a4f1c1299eaf910160405180910390a16040516001600160a01b03821681527f9465fa0c962cc76958e6373a993326400c1c94f8be2fe3a952adfa7f60b2ea269060200160405180910390a1505050565b606060007fbb8310d486368db6bd6f849402fdd73ad53d316b5a4b2644ad6efe0f941286d860001b8d8d8d8d604051611d229291906130bf565b604051908190038120611d48949392918e908e908e908e908e908e908e906020016130cf565b60408051601f1981840301815291905280516020909101209050601960f81b600160f81b611dc660007f47e79534a245952e8b16893a336b85a3d9ea9fa8c573f3d803afb92a794692184660408051602081019390935282015230606082015260800160405160208183030381529060405280519060200120905090565b6040517fff0000000000000000000000000000000000000000000000000000000000000093841660208201529290911660218301526022820152604281018290526062016040516020818303038152906040529150509b9a5050505050505050505050565b611e33612037565b611e5b817f6c9a6c4a39284e37ed1cf53d337577d14212a4870fb976a4366c693b939918d555565b6040516001600160a01b03821681527f5ac6c46c93c8d0e53714ba3b53db3e7c046da994313d7ed0d192028bc7c228b090602001611044565b611e9c612037565b806001600354611eac9190613026565b1015611ee25760405162461bcd60e51b8152602060048201526005602482015264475332303160d81b6044820152606401610767565b6001600160a01b03821615801590611f0457506001600160a01b038216600114155b611f385760405162461bcd60e51b8152602060048201526005602482015264475332303360d81b6044820152606401610767565b6001600160a01b03838116600090815260026020526040902054811690831614611f8c5760405162461bcd60e51b8152602060048201526005602482015264475332303560d81b6044820152606401610767565b6001600160a01b03828116600081815260026020526040808220805488861684529183208054929095166001600160a01b03199283161790945591815282549091169091556003805491611fdf8361313f565b90915550506040516001600160a01b03831681527ff8d49fc529812e9a7c5c50e69c20f0dccc0db8fa95c98bc58cc9a4f1c1299eaf9060200160405180910390a18060045414612032576120328161104f565b505050565b33301461206e5760405162461bcd60e51b8152602060048201526005602482015264475330333160d81b6044820152606401610767565b565b60008260000361208257506000610d3c565b600061208e8385612ed1565b90508261209b8583613004565b146120a557600080fd5b9392505050565b6000806120b98385612fec565b9050838110156120a557600080fd5b600060018360018111156120de576120de612ef0565b036120f6576000808551602087018986f49050612106565b600080855160208701888a87f190505b95945050505050565b60008183101561211f57816120a5565b5090919050565b60008282111561213557600080fd5b6000610e498385613026565b6000806001600160a01b03831615612159578261215b565b325b90506001600160a01b0384166121ee5761218d3a861061217b573a61217d565b855b61218789896120ac565b90612070565b6040519092506001600160a01b0382169083156108fc029084906000818181858888f193505050506121e95760405162461bcd60e51b8152602060048201526005602482015264475330313160d81b6044820152606401610767565b61223d565b6121fc8561218789896120ac565b915061220984828461256f565b61223d5760405162461bcd60e51b815260206004820152600560248201526423a998189960d91b6044820152606401610767565b5095945050505050565b6004541561227f5760405162461bcd60e51b8152602060048201526005602482015264047533230360dc1b6044820152606401610767565b81518111156122b85760405162461bcd60e51b8152602060048201526005602482015264475332303160d81b6044820152606401610767565b60018110156122f15760405162461bcd60e51b815260206004820152600560248201526423a999181960d91b6044820152606401610767565b600160005b83518110156124425760008482815181106123135761231361303d565b6020026020010151905060006001600160a01b0316816001600160a01b03161415801561234a57506001600160a01b038116600114155b801561235f57506001600160a01b0381163014155b801561237d5750806001600160a01b0316836001600160a01b031614155b6123b15760405162461bcd60e51b8152602060048201526005602482015264475332303360d81b6044820152606401610767565b6001600160a01b0381811660009081526002602052604090205416156124015760405162461bcd60e51b815260206004820152600560248201526411d4cc8c0d60da1b6044820152606401610767565b6001600160a01b03928316600090815260026020526040902080546001600160a01b031916938216939093179092558061243a81612e2e565b9150506122f6565b506001600160a01b0316600090815260026020526040902080546001600160a01b03191660011790559051600355600455565b600160008190526020527fcc69885fda6bcc1a4ace058b4a62bf5e179ea78fd58a1ccd71c22cc9b688792f546001600160a01b0316156124df5760405162461bcd60e51b8152602060048201526005602482015264047533130360dc1b6044820152606401610767565b6001600081905260208190527fcc69885fda6bcc1a4ace058b4a62bf5e179ea78fd58a1ccd71c22cc9b688792f80546001600160a01b03191690911790556001600160a01b038216156108805761253b8260008360015a6120c8565b6108805760405162461bcd60e51b8152602060048201526005602482015264047533030360dc1b6044820152606401610767565b604080516001600160a01b03841660248201526044808201849052825180830390910181526064909101909152602080820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1663a9059cbb60e01b1781528251600093929184919082896127105a03f13d80156125f657602081146125fe5760009350612609565b819350612609565b600051158215171593505b5050509392505050565b6001600160a01b038116811461262857600080fd5b50565b803561263681612613565b919050565b6000806040838503121561264e57600080fd5b823561265981612613565b946020939093013593505050565b634e487b7160e01b600052604160045260246000fd5b600082601f83011261268e57600080fd5b813567ffffffffffffffff808211156126a9576126a9612667565b604051601f8301601f19908116603f011681019082821181831017156126d1576126d1612667565b816040528381528660208588010111156126ea57600080fd5b836020870160208301376000602085830101528094505050505092915050565b6000806000806080858703121561272057600080fd5b84359350602085013567ffffffffffffffff8082111561273f57600080fd5b61274b8883890161267d565b9450604087013591508082111561276157600080fd5b5061276e8782880161267d565b949793965093946060013593505050565b60006020828403121561279157600080fd5b81356120a581612613565b80356002811061263657600080fd5b600080600080608085870312156127c157600080fd5b84356127cc81612613565b935060208501359250604085013567ffffffffffffffff8111156127ef57600080fd5b6127fb8782880161267d565b92505061280a6060860161279c565b905092959194509250565b6000815180845260005b8181101561283b5760208185018101518683018201520161281f565b8181111561284d576000602083870101525b50601f01601f19169290920160200192915050565b8215158152604060208201526000610e496040830184612815565b6000806040838503121561289057600080fd5b50508035926020909101359150565b6020815260006120a56020830184612815565b6000602082840312156128c457600080fd5b5035919050565b60008083601f8401126128dd57600080fd5b50813567ffffffffffffffff8111156128f557600080fd5b60208301915083602082850101111561290d57600080fd5b9250929050565b60008060008060008060008060008060006101408c8e03121561293657600080fd5b61293f8c61262b565b9a5060208c0135995067ffffffffffffffff8060408e0135111561296257600080fd5b6129728e60408f01358f016128cb565b909a50985061298360608e0161279c565b975060808d0135965060a08d0135955060c08d013594506129a660e08e0161262b565b93506129b56101008e0161262b565b9250806101208e013511156129c957600080fd5b506129db8d6101208e01358e0161267d565b90509295989b509295989b9093969950565b600080600060608486031215612a0257600080fd5b83359250602084013567ffffffffffffffff80821115612a2157600080fd5b612a2d8783880161267d565b93506040860135915080821115612a4357600080fd5b50612a508682870161267d565b9150509250925092565b600081518084526020808501945080840160005b83811015612a935781516001600160a01b031687529582019590820190600101612a6e565b509495945050505050565b6020815260006120a56020830184612a5a565b60008060408385031215612ac457600080fd5b8235612acf81612613565b9150602083013567ffffffffffffffff811115612aeb57600080fd5b612af78582860161267d565b9150509250929050565b6000806000806000806000806000806101008b8d031215612b2157600080fd5b8a3567ffffffffffffffff80821115612b3957600080fd5b818d0191508d601f830112612b4d57600080fd5b813581811115612b5c57600080fd5b8e60208260051b8501011115612b7157600080fd5b60208381019d50909b508d01359950612b8c60408e0161262b565b985060608d0135915080821115612ba257600080fd5b50612baf8d828e016128cb565b9097509550612bc2905060808c0161262b565b9350612bd060a08c0161262b565b925060c08b01359150612be560e08c0161262b565b90509295989b9194979a5092959850565b600080600080600060808688031215612c0e57600080fd5b8535612c1981612613565b945060208601359350604086013567ffffffffffffffff811115612c3c57600080fd5b612c48888289016128cb565b9094509250612c5b90506060870161279c565b90509295509295909350565b604081526000612c7a6040830185612a5a565b90506001600160a01b03831660208301529392505050565b60008060008060008060008060008060006101408c8e031215612cb457600080fd5b8b35612cbf81612613565b9a5060208c0135995060408c013567ffffffffffffffff811115612ce257600080fd5b612cee8e828f016128cb565b909a509850612d01905060608d0161279c565b965060808c0135955060a08c0135945060c08c0135935060e08c0135612d2681612613565b92506101008c0135612d3781612613565b809250506101208c013590509295989b509295989b9093969950565b60008060408385031215612d6657600080fd5b8235612d7181612613565b91506020830135612d8181612613565b809150509250929050565b600080600060608486031215612da157600080fd5b8335612dac81612613565b92506020840135612dbc81612613565b91506040840135612dcc81612613565b809150509250925092565b600080600060608486031215612dec57600080fd5b8335612df781612613565b92506020840135612e0781612613565b929592945050506040919091013590565b634e487b7160e01b600052601160045260246000fd5b600060018201612e4057612e40612e18565b5060010190565b604081526000612e5a6040830185612815565b82810360208401526121068185612815565b600060208284031215612e7e57600080fd5b81517fffffffff00000000000000000000000000000000000000000000000000000000811681146120a557600080fd5b600060ff821660ff841680821015612ec857612ec8612e18565b90039392505050565b6000816000190483118215151615612eeb57612eeb612e18565b500290565b634e487b7160e01b600052602160045260246000fd5b60028110612f2457634e487b7160e01b600052602160045260246000fd5b9052565b60006101606001600160a01b038f1683528d60208401528060408401528b81840152506101808b8d828501376000838d01820152601f8c01601f19168301612f73606085018d612f06565b8a60808501528960a08501528860c0850152612f9a60e08501896001600160a01b03169052565b6001600160a01b0387166101008501528184820301610120850152612fc182820187612815565b92505050612fdb6101408301846001600160a01b03169052565b9d9c50505050505050505050505050565b60008219821115612fff57612fff612e18565b500190565b60008261302157634e487b7160e01b600052601260045260246000fd5b500490565b60008282101561303857613038612e18565b500390565b634e487b7160e01b600052603260045260246000fd5b6080808252810185905260008660a08301825b8881101561309657823561307981612613565b6001600160a01b0316825260209283019290910190600101613066565b50602084019690965250506001600160a01b039283166040820152911660609091015292915050565b8183823760009101908152919050565b6000610160820190508c82526001600160a01b03808d1660208401528b60408401528a6060840152613104608084018b612f06565b60a083019890985260c082019690965260e0810194909452918516610100840152909316610120820152610140019190915295945050505050565b60008161314e5761314e612e18565b50600019019056fea2646970667358221220bdd83c9fe2fd154f451eebc0429f5ce81afb903907a8844e8d5c9d1e9b025e2a64736f6c634300080f0033',
  deployedBytecode: '0x6080604052600436106101dc5760003560e01c8063affed0e011610102578063e19a9dd911610095578063f08a032311610064578063f08a032314610620578063f698da2514610640578063f8dc5dd9146106a7578063ffa1ad74146106c757610218565b8063e19a9dd9146105ab578063e318b52b146105cb578063e75235b8146105eb578063e86637db1461060057610218565b8063cc2f8452116100d1578063cc2f84521461051d578063d4d9bdcd1461054b578063d8d11f781461056b578063e009cfde1461058b57610218565b8063affed0e0146104a7578063b4faba09146104bd578063b63e800d146104dd578063c4ca3a9c146104fd57610218565b80635624b25b1161017a5780636a761202116101495780636a7612021461041a5780637d8329741461042d578063934f3a1114610465578063a0e67e2b1461048557610218565b80635624b25b146103805780635ae6bd37146103ad578063610b5925146103da578063694e80c3146103fa57610218565b80632f54bf6e116101b65780632f54bf6e146102f55780633408e47014610315578063468721a7146103325780635229073f1461035257610218565b80630d582f131461027e57806312fb68e0146102a05780632d9ad53d146102c057610218565b366102185760405134815233907f3d0ce9bfc3ed7d6862dbb28b2dea94561fe714a1b4d019aa8af39730d1ad7c3d9060200160405180910390a2005b34801561022457600080fd5b507f6c9a6c4a39284e37ed1cf53d337577d14212a4870fb976a4366c693b939918d580548061024f57005b36600080373360601b365260008060143601600080855af190503d6000803e80610278573d6000fd5b503d6000f35b34801561028a57600080fd5b5061029e61029936600461263b565b6106f8565b005b3480156102ac57600080fd5b5061029e6102bb36600461270a565b610884565b3480156102cc57600080fd5b506102e06102db36600461277f565b610d07565b60405190151581526020015b60405180910390f35b34801561030157600080fd5b506102e061031036600461277f565b610d42565b34801561032157600080fd5b50465b6040519081526020016102ec565b34801561033e57600080fd5b506102e061034d3660046127ab565b610d7a565b34801561035e57600080fd5b5061037261036d3660046127ab565b610e51565b6040516102ec929190612862565b34801561038c57600080fd5b506103a061039b36600461287d565b610e87565b6040516102ec919061289f565b3480156103b957600080fd5b506103246103c83660046128b2565b60076020526000908152604090205481565b3480156103e657600080fd5b5061029e6103f536600461277f565b610f0d565b34801561040657600080fd5b5061029e6104153660046128b2565b61104f565b6102e0610428366004612914565b6110ff565b34801561043957600080fd5b5061032461044836600461263b565b600860209081526000928352604080842090915290825290205481565b34801561047157600080fd5b5061029e6104803660046129ed565b611448565b34801561049157600080fd5b5061049a611492565b6040516102ec9190612a9e565b3480156104b357600080fd5b5061032460055481565b3480156104c957600080fd5b5061029e6104d8366004612ab1565b611583565b3480156104e957600080fd5b5061029e6104f8366004612b01565b6115a6565b34801561050957600080fd5b50610324610518366004612bf6565b6116c7565b34801561052957600080fd5b5061053d61053836600461263b565b611761565b6040516102ec929190612c67565b34801561055757600080fd5b5061029e6105663660046128b2565b61185b565b34801561057757600080fd5b50610324610586366004612c92565b6118f0565b34801561059757600080fd5b5061029e6105a6366004612d53565b61191d565b3480156105b757600080fd5b5061029e6105c636600461277f565b611a4c565b3480156105d757600080fd5b5061029e6105e6366004612d8c565b611ab1565b3480156105f757600080fd5b50600454610324565b34801561060c57600080fd5b506103a061061b366004612c92565b611ce8565b34801561062c57600080fd5b5061029e61063b36600461277f565b611e2b565b34801561064c57600080fd5b5061032460007f47e79534a245952e8b16893a336b85a3d9ea9fa8c573f3d803afb92a794692184660408051602081019390935282015230606082015260800160405160208183030381529060405280519060200120905090565b3480156106b357600080fd5b5061029e6106c2366004612dd7565b611e94565b3480156106d357600080fd5b506103a0604051806040016040528060058152602001640312e332e360dc1b81525081565b610700612037565b6001600160a01b0382161580159061072257506001600160a01b038216600114155b801561073757506001600160a01b0382163014155b6107705760405162461bcd60e51b8152602060048201526005602482015264475332303360d81b60448201526064015b60405180910390fd5b6001600160a01b0382811660009081526002602052604090205416156107c05760405162461bcd60e51b815260206004820152600560248201526411d4cc8c0d60da1b6044820152606401610767565b60026020527fe90b7bceb6e7df5418fb78d8ee546e97c83a08bbccc01a0644d599ccd2a7c2e080546001600160a01b038481166000818152604081208054939094166001600160a01b03199384161790935560018352835490911617909155600380549161082d83612e2e565b90915550506040516001600160a01b03831681527f9465fa0c962cc76958e6373a993326400c1c94f8be2fe3a952adfa7f60b2ea269060200160405180910390a18060045414610880576108808161104f565b5050565b61088f816041612070565b825110156108c75760405162461bcd60e51b8152602060048201526005602482015264047533032360dc1b6044820152606401610767565b6000808060008060005b86811015610cfb576041818102890160208101516040820151919092015160ff16955090935091506000849003610aba579193508391610912876041612070565b8210156109495760405162461bcd60e51b8152602060048201526005602482015264475330323160d81b6044820152606401610767565b87516109568360206120ac565b111561098c5760405162461bcd60e51b815260206004820152600560248201526423a998191960d91b6044820152606401610767565b6020828901810151895190916109af9083906109a99087906120ac565b906120ac565b11156109e55760405162461bcd60e51b8152602060048201526005602482015264475330323360d81b6044820152606401610767565b6040516320c13b0b60e01b8082528a8501602001916001600160a01b038916906320c13b0b90610a1b908f908690600401612e47565b602060405180830381865afa158015610a38573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a5c9190612e6c565b7fffffffff000000000000000000000000000000000000000000000000000000001614610ab35760405162461bcd60e51b815260206004820152600560248201526411d4cc0c8d60da1b6044820152606401610767565b5050610c61565b8360ff16600103610b3c579193508391336001600160a01b0384161480610b0357506001600160a01b03851660009081526008602090815260408083208d845290915290205415155b610b375760405162461bcd60e51b8152602060048201526005602482015264475330323560d81b6044820152606401610767565b610c61565b601e8460ff161115610c01576040517f19457468657265756d205369676e6564204d6573736167653a0a3332000000006020820152603c81018b9052600190605c0160405160208183030381529060405280519060200120600486610ba19190612eae565b6040805160008152602081018083529390935260ff90911690820152606081018590526080810184905260a0016020604051602081039080840390855afa158015610bf0573d6000803e3d6000fd5b505050602060405103519450610c61565b6040805160008152602081018083528c905260ff861691810191909152606081018490526080810183905260019060a0016020604051602081039080840390855afa158015610c54573d6000803e3d6000fd5b5050506020604051035194505b856001600160a01b0316856001600160a01b0316118015610c9b57506001600160a01b038581166000908152600260205260409020541615155b8015610cb157506001600160a01b038516600114155b610ce55760405162461bcd60e51b815260206004820152600560248201526423a998191b60d91b6044820152606401610767565b8495508080610cf390612e2e565b9150506108d1565b50505050505050505050565b600060016001600160a01b03831614801590610d3c57506001600160a01b038281166000908152600160205260409020541615155b92915050565b60006001600160a01b038216600114801590610d3c5750506001600160a01b0390811660009081526002602052604090205416151590565b600033600114801590610da45750336000908152600160205260409020546001600160a01b031615155b610dd85760405162461bcd60e51b815260206004820152600560248201526411d4cc4c0d60da1b6044820152606401610767565b610de5858585855a6120c8565b90508015610e1d5760405133907f6895c13664aa4f67288b25d7a21d7aaa34916e355fb9b6fae0a139a9085becb890600090a2610e49565b60405133907facd2c8702804128fdb0db2bb49f6d127dd0181c13fd45dbfe16de0930e2bd37590600090a25b949350505050565b60006060610e6186868686610d7a565b915060405160203d0181016040523d81523d6000602083013e8091505094509492505050565b60606000610e96836020612ed1565b67ffffffffffffffff811115610eae57610eae612667565b6040519080825280601f01601f191660200182016040528015610ed8576020820181803683370190505b50905060005b83811015610f05578481015460208083028401015280610efd81612e2e565b915050610ede565b509392505050565b610f15612037565b6001600160a01b03811615801590610f3757506001600160a01b038116600114155b610f6b5760405162461bcd60e51b8152602060048201526005602482015264475331303160d81b6044820152606401610767565b6001600160a01b038181166000908152600160205260409020541615610fbb5760405162461bcd60e51b815260206004820152600560248201526423a998981960d91b6044820152606401610767565b600160208181527fcc69885fda6bcc1a4ace058b4a62bf5e179ea78fd58a1ccd71c22cc9b688792f80546001600160a01b03858116600081815260408082208054949095166001600160a01b031994851617909455959095528254168417909155519182527fecdf3a3effea5783a3c4c2140e677577666428d44ed9d474a0b3a4c9943f844091015b60405180910390a150565b611057612037565b6003548111156110915760405162461bcd60e51b8152602060048201526005602482015264475332303160d81b6044820152606401610767565b60018110156110ca5760405162461bcd60e51b815260206004820152600560248201526423a999181960d91b6044820152606401610767565b60048190556040518181527f610f7ff2b304ae8903c3de74c60c6ab1f7d6226b3f52c5161905bb5ad4039c9390602001611044565b60008060006111198e8e8e8e8e8e8e8e8e8e600554611ce8565b60058054919250600061112b83612e2e565b9091555050805160208201209150611144828286611448565b50600061116f7f4a204f620c8c5ccdca3fd54d003badd85ba500436a431f0cbda4f558c93c34c85490565b90506001600160a01b038116156111f557806001600160a01b03166375f0bb528f8f8f8f8f8f8f8f8f8f8f336040518d63ffffffff1660e01b81526004016111c29c9b9a99989796959493929190612f28565b600060405180830381600087803b1580156111dc57600080fd5b505af11580156111f0573d6000803e3d6000fd5b505050505b6112216112048a6109c4612fec565b603f6112118c6040612ed1565b61121b9190613004565b9061210f565b61122d906101f4612fec565b5a10156112645760405162461bcd60e51b8152602060048201526005602482015264047533031360dc1b6044820152606401610767565b60005a90506112d58f8f8f8f8080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050508e8c6000146112c2578e6120c8565b6109c45a6112d09190613026565b6120c8565b93506112e25a8290612126565b905083806112ef57508915155b806112f957508715155b61132d5760405162461bcd60e51b8152602060048201526005602482015264475330313360d81b6044820152606401610767565b6000881561134557611342828b8b8b8b612141565b90505b84156113895760408051858152602081018390527f442e715f626346e8c54381002da614f62bee8d27386535b2521ec8540898556e910160405180910390a16113c3565b60408051858152602081018390527f23428b18acfb3ea64b08dc0c1d296ea9c09702c09083ca5272e64d115b687d23910160405180910390a15b50506001600160a01b0381161561143757604051631264e26d60e31b81526004810183905283151560248201526001600160a01b03821690639327136890604401600060405180830381600087803b15801561141e57600080fd5b505af1158015611432573d6000803e3d6000fd5b505050505b50509b9a5050505050505050505050565b600454806114805760405162461bcd60e51b8152602060048201526005602482015264475330303160d81b6044820152606401610767565b61148c84848484610884565b50505050565b6060600060035467ffffffffffffffff8111156114b1576114b1612667565b6040519080825280602002602001820160405280156114da578160200160208202803683370190505b506001600090815260026020527fe90b7bceb6e7df5418fb78d8ee546e97c83a08bbccc01a0644d599ccd2a7c2e054919250906001600160a01b03165b6001600160a01b03811660011461157b578083838151811061153b5761153b61303d565b6001600160a01b0392831660209182029290920181019190915291811660009081526002909252604090912054168161157381612e2e565b925050611517565b509092915050565b600080825160208401855af480600052503d6020523d600060403e60403d016000fd5b6115e48a8a808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152508c9250612247915050565b6001600160a01b0384161561161b5761161b847f6c9a6c4a39284e37ed1cf53d337577d14212a4870fb976a4366c693b939918d555565b61165b8787878080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061247592505050565b81156116725761167082600060018685612141565b505b336001600160a01b03167f141df868a6331af528e38c83b7aa03edc19be66e37ae67f9285bf4f8e3c6a1a88b8b8b8b896040516116b3959493929190613053565b60405180910390a250505050505050505050565b6000805a9050611710878787878080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525089925050505a6120c8565b61171957600080fd5b60005a6117269083613026565b90508060405160200161173b91815260200190565b60408051601f198184030181529082905262461bcd60e51b82526107679160040161289f565b606060008267ffffffffffffffff81111561177e5761177e612667565b6040519080825280602002602001820160405280156117a7578160200160208202803683370190505b506001600160a01b0380861660009081526001602052604081205492945091165b6001600160a01b038116158015906117ea57506001600160a01b038116600114155b80156117f557508482105b1561184d578084838151811061180d5761180d61303d565b6001600160a01b0392831660209182029290920181019190915291811660009081526001909252604090912054168161184581612e2e565b9250506117c8565b908352919491935090915050565b336000908152600260205260409020546001600160a01b03166118a85760405162461bcd60e51b8152602060048201526005602482015264047533033360dc1b6044820152606401610767565b336000818152600860209081526040808320858452909152808220600190555183917ff2a0eb156472d1440255b0d7c1e19cc07115d1051fe605b0dce69acfec884d9c91a350565b60006119058c8c8c8c8c8c8c8c8c8c8c611ce8565b8051906020012090509b9a5050505050505050505050565b611925612037565b6001600160a01b0381161580159061194757506001600160a01b038116600114155b61197b5760405162461bcd60e51b8152602060048201526005602482015264475331303160d81b6044820152606401610767565b6001600160a01b038281166000908152600160205260409020548116908216146119cf5760405162461bcd60e51b8152602060048201526005602482015264475331303360d81b6044820152606401610767565b6001600160a01b038181166000818152600160209081526040808320805488871685528285208054919097166001600160a01b03199182161790965592849052825490941690915591519081527faab4fa2b463f581b2b32cb3b7e3b704b9ce37cc209b5fb4d77e593ace405427691015b60405180910390a15050565b611a54612037565b7f4a204f620c8c5ccdca3fd54d003badd85ba500436a431f0cbda4f558c93c34c88181556040516001600160a01b03831681527f1151116914515bc0891ff9047a6cb32cf902546f83066499bcf8ba33d2353fa290602001611a40565b611ab9612037565b6001600160a01b03811615801590611adb57506001600160a01b038116600114155b8015611af057506001600160a01b0381163014155b611b245760405162461bcd60e51b8152602060048201526005602482015264475332303360d81b6044820152606401610767565b6001600160a01b038181166000908152600260205260409020541615611b745760405162461bcd60e51b815260206004820152600560248201526411d4cc8c0d60da1b6044820152606401610767565b6001600160a01b03821615801590611b9657506001600160a01b038216600114155b611bca5760405162461bcd60e51b8152602060048201526005602482015264475332303360d81b6044820152606401610767565b6001600160a01b03838116600090815260026020526040902054811690831614611c1e5760405162461bcd60e51b8152602060048201526005602482015264475332303560d81b6044820152606401610767565b6001600160a01b038281166000818152600260209081526040808320805487871680865283862080549289166001600160a01b0319938416179055968a1685528285208054821690971790965592849052825490941690915591519081527ff8d49fc529812e9a7c5c50e69c20f0dccc0db8fa95c98bc58cc9a4f1c1299eaf910160405180910390a16040516001600160a01b03821681527f9465fa0c962cc76958e6373a993326400c1c94f8be2fe3a952adfa7f60b2ea269060200160405180910390a1505050565b606060007fbb8310d486368db6bd6f849402fdd73ad53d316b5a4b2644ad6efe0f941286d860001b8d8d8d8d604051611d229291906130bf565b604051908190038120611d48949392918e908e908e908e908e908e908e906020016130cf565b60408051601f1981840301815291905280516020909101209050601960f81b600160f81b611dc660007f47e79534a245952e8b16893a336b85a3d9ea9fa8c573f3d803afb92a794692184660408051602081019390935282015230606082015260800160405160208183030381529060405280519060200120905090565b6040517fff0000000000000000000000000000000000000000000000000000000000000093841660208201529290911660218301526022820152604281018290526062016040516020818303038152906040529150509b9a5050505050505050505050565b611e33612037565b611e5b817f6c9a6c4a39284e37ed1cf53d337577d14212a4870fb976a4366c693b939918d555565b6040516001600160a01b03821681527f5ac6c46c93c8d0e53714ba3b53db3e7c046da994313d7ed0d192028bc7c228b090602001611044565b611e9c612037565b806001600354611eac9190613026565b1015611ee25760405162461bcd60e51b8152602060048201526005602482015264475332303160d81b6044820152606401610767565b6001600160a01b03821615801590611f0457506001600160a01b038216600114155b611f385760405162461bcd60e51b8152602060048201526005602482015264475332303360d81b6044820152606401610767565b6001600160a01b03838116600090815260026020526040902054811690831614611f8c5760405162461bcd60e51b8152602060048201526005602482015264475332303560d81b6044820152606401610767565b6001600160a01b03828116600081815260026020526040808220805488861684529183208054929095166001600160a01b03199283161790945591815282549091169091556003805491611fdf8361313f565b90915550506040516001600160a01b03831681527ff8d49fc529812e9a7c5c50e69c20f0dccc0db8fa95c98bc58cc9a4f1c1299eaf9060200160405180910390a18060045414612032576120328161104f565b505050565b33301461206e5760405162461bcd60e51b8152602060048201526005602482015264475330333160d81b6044820152606401610767565b565b60008260000361208257506000610d3c565b600061208e8385612ed1565b90508261209b8583613004565b146120a557600080fd5b9392505050565b6000806120b98385612fec565b9050838110156120a557600080fd5b600060018360018111156120de576120de612ef0565b036120f6576000808551602087018986f49050612106565b600080855160208701888a87f190505b95945050505050565b60008183101561211f57816120a5565b5090919050565b60008282111561213557600080fd5b6000610e498385613026565b6000806001600160a01b03831615612159578261215b565b325b90506001600160a01b0384166121ee5761218d3a861061217b573a61217d565b855b61218789896120ac565b90612070565b6040519092506001600160a01b0382169083156108fc029084906000818181858888f193505050506121e95760405162461bcd60e51b8152602060048201526005602482015264475330313160d81b6044820152606401610767565b61223d565b6121fc8561218789896120ac565b915061220984828461256f565b61223d5760405162461bcd60e51b815260206004820152600560248201526423a998189960d91b6044820152606401610767565b5095945050505050565b6004541561227f5760405162461bcd60e51b8152602060048201526005602482015264047533230360dc1b6044820152606401610767565b81518111156122b85760405162461bcd60e51b8152602060048201526005602482015264475332303160d81b6044820152606401610767565b60018110156122f15760405162461bcd60e51b815260206004820152600560248201526423a999181960d91b6044820152606401610767565b600160005b83518110156124425760008482815181106123135761231361303d565b6020026020010151905060006001600160a01b0316816001600160a01b03161415801561234a57506001600160a01b038116600114155b801561235f57506001600160a01b0381163014155b801561237d5750806001600160a01b0316836001600160a01b031614155b6123b15760405162461bcd60e51b8152602060048201526005602482015264475332303360d81b6044820152606401610767565b6001600160a01b0381811660009081526002602052604090205416156124015760405162461bcd60e51b815260206004820152600560248201526411d4cc8c0d60da1b6044820152606401610767565b6001600160a01b03928316600090815260026020526040902080546001600160a01b031916938216939093179092558061243a81612e2e565b9150506122f6565b506001600160a01b0316600090815260026020526040902080546001600160a01b03191660011790559051600355600455565b600160008190526020527fcc69885fda6bcc1a4ace058b4a62bf5e179ea78fd58a1ccd71c22cc9b688792f546001600160a01b0316156124df5760405162461bcd60e51b8152602060048201526005602482015264047533130360dc1b6044820152606401610767565b6001600081905260208190527fcc69885fda6bcc1a4ace058b4a62bf5e179ea78fd58a1ccd71c22cc9b688792f80546001600160a01b03191690911790556001600160a01b038216156108805761253b8260008360015a6120c8565b6108805760405162461bcd60e51b8152602060048201526005602482015264047533030360dc1b6044820152606401610767565b604080516001600160a01b03841660248201526044808201849052825180830390910181526064909101909152602080820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1663a9059cbb60e01b1781528251600093929184919082896127105a03f13d80156125f657602081146125fe5760009350612609565b819350612609565b600051158215171593505b5050509392505050565b6001600160a01b038116811461262857600080fd5b50565b803561263681612613565b919050565b6000806040838503121561264e57600080fd5b823561265981612613565b946020939093013593505050565b634e487b7160e01b600052604160045260246000fd5b600082601f83011261268e57600080fd5b813567ffffffffffffffff808211156126a9576126a9612667565b604051601f8301601f19908116603f011681019082821181831017156126d1576126d1612667565b816040528381528660208588010111156126ea57600080fd5b836020870160208301376000602085830101528094505050505092915050565b6000806000806080858703121561272057600080fd5b84359350602085013567ffffffffffffffff8082111561273f57600080fd5b61274b8883890161267d565b9450604087013591508082111561276157600080fd5b5061276e8782880161267d565b949793965093946060013593505050565b60006020828403121561279157600080fd5b81356120a581612613565b80356002811061263657600080fd5b600080600080608085870312156127c157600080fd5b84356127cc81612613565b935060208501359250604085013567ffffffffffffffff8111156127ef57600080fd5b6127fb8782880161267d565b92505061280a6060860161279c565b905092959194509250565b6000815180845260005b8181101561283b5760208185018101518683018201520161281f565b8181111561284d576000602083870101525b50601f01601f19169290920160200192915050565b8215158152604060208201526000610e496040830184612815565b6000806040838503121561289057600080fd5b50508035926020909101359150565b6020815260006120a56020830184612815565b6000602082840312156128c457600080fd5b5035919050565b60008083601f8401126128dd57600080fd5b50813567ffffffffffffffff8111156128f557600080fd5b60208301915083602082850101111561290d57600080fd5b9250929050565b60008060008060008060008060008060006101408c8e03121561293657600080fd5b61293f8c61262b565b9a5060208c0135995067ffffffffffffffff8060408e0135111561296257600080fd5b6129728e60408f01358f016128cb565b909a50985061298360608e0161279c565b975060808d0135965060a08d0135955060c08d013594506129a660e08e0161262b565b93506129b56101008e0161262b565b9250806101208e013511156129c957600080fd5b506129db8d6101208e01358e0161267d565b90509295989b509295989b9093969950565b600080600060608486031215612a0257600080fd5b83359250602084013567ffffffffffffffff80821115612a2157600080fd5b612a2d8783880161267d565b93506040860135915080821115612a4357600080fd5b50612a508682870161267d565b9150509250925092565b600081518084526020808501945080840160005b83811015612a935781516001600160a01b031687529582019590820190600101612a6e565b509495945050505050565b6020815260006120a56020830184612a5a565b60008060408385031215612ac457600080fd5b8235612acf81612613565b9150602083013567ffffffffffffffff811115612aeb57600080fd5b612af78582860161267d565b9150509250929050565b6000806000806000806000806000806101008b8d031215612b2157600080fd5b8a3567ffffffffffffffff80821115612b3957600080fd5b818d0191508d601f830112612b4d57600080fd5b813581811115612b5c57600080fd5b8e60208260051b8501011115612b7157600080fd5b60208381019d50909b508d01359950612b8c60408e0161262b565b985060608d0135915080821115612ba257600080fd5b50612baf8d828e016128cb565b9097509550612bc2905060808c0161262b565b9350612bd060a08c0161262b565b925060c08b01359150612be560e08c0161262b565b90509295989b9194979a5092959850565b600080600080600060808688031215612c0e57600080fd5b8535612c1981612613565b945060208601359350604086013567ffffffffffffffff811115612c3c57600080fd5b612c48888289016128cb565b9094509250612c5b90506060870161279c565b90509295509295909350565b604081526000612c7a6040830185612a5a565b90506001600160a01b03831660208301529392505050565b60008060008060008060008060008060006101408c8e031215612cb457600080fd5b8b35612cbf81612613565b9a5060208c0135995060408c013567ffffffffffffffff811115612ce257600080fd5b612cee8e828f016128cb565b909a509850612d01905060608d0161279c565b965060808c0135955060a08c0135945060c08c0135935060e08c0135612d2681612613565b92506101008c0135612d3781612613565b809250506101208c013590509295989b509295989b9093969950565b60008060408385031215612d6657600080fd5b8235612d7181612613565b91506020830135612d8181612613565b809150509250929050565b600080600060608486031215612da157600080fd5b8335612dac81612613565b92506020840135612dbc81612613565b91506040840135612dcc81612613565b809150509250925092565b600080600060608486031215612dec57600080fd5b8335612df781612613565b92506020840135612e0781612613565b929592945050506040919091013590565b634e487b7160e01b600052601160045260246000fd5b600060018201612e4057612e40612e18565b5060010190565b604081526000612e5a6040830185612815565b82810360208401526121068185612815565b600060208284031215612e7e57600080fd5b81517fffffffff00000000000000000000000000000000000000000000000000000000811681146120a557600080fd5b600060ff821660ff841680821015612ec857612ec8612e18565b90039392505050565b6000816000190483118215151615612eeb57612eeb612e18565b500290565b634e487b7160e01b600052602160045260246000fd5b60028110612f2457634e487b7160e01b600052602160045260246000fd5b9052565b60006101606001600160a01b038f1683528d60208401528060408401528b81840152506101808b8d828501376000838d01820152601f8c01601f19168301612f73606085018d612f06565b8a60808501528960a08501528860c0850152612f9a60e08501896001600160a01b03169052565b6001600160a01b0387166101008501528184820301610120850152612fc182820187612815565b92505050612fdb6101408301846001600160a01b03169052565b9d9c50505050505050505050505050565b60008219821115612fff57612fff612e18565b500190565b60008261302157634e487b7160e01b600052601260045260246000fd5b500490565b60008282101561303857613038612e18565b500390565b634e487b7160e01b600052603260045260246000fd5b6080808252810185905260008660a08301825b8881101561309657823561307981612613565b6001600160a01b0316825260209283019290910190600101613066565b50602084019690965250506001600160a01b039283166040820152911660609091015292915050565b8183823760009101908152919050565b6000610160820190508c82526001600160a01b03808d1660208401528b60408401528a6060840152613104608084018b612f06565b60a083019890985260c082019690965260e0810194909452918516610100840152909316610120820152610140019190915295945050505050565b60008161314e5761314e612e18565b50600019019056fea2646970667358221220bdd83c9fe2fd154f451eebc0429f5ce81afb903907a8844e8d5c9d1e9b025e2a64736f6c634300080f0033',
  linkReferences: {},
  deployedLinkReferences: {},
};
