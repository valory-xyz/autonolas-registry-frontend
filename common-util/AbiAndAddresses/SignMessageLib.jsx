export const SIGN_MESSAGE_LIB_CONTRACT = {
  contractName: 'SignMessageLib',
  version: '1.3.0',
  released: true,
  abi: [
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
      inputs: [
        {
          internalType: 'bytes',
          name: 'message',
          type: 'bytes',
        },
      ],
      name: 'getMessageHash',
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
          internalType: 'bytes',
          name: '_data',
          type: 'bytes',
        },
      ],
      name: 'signMessage',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ],
};
