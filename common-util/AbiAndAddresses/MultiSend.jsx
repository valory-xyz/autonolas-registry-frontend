export const MULTI_SEND_CONTRACT = {
  _format: 'hh-sol-artifact-1',
  contractName: 'MultiSendCallOnly',
  sourceName:
    '@gnosis.pm/safe-contracts/contracts/libraries/MultiSendCallOnly.sol',
  abi: [
    {
      inputs: [
        {
          internalType: 'bytes',
          name: 'transactions',
          type: 'bytes',
        },
      ],
      name: 'multiSend',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
  ],
  bytecode: '',
  deployedBytecode: '',
  linkReferences: {},
  deployedLinkReferences: {},
};
