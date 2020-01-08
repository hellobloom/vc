/**
 * Copied from compilation output of AttestationLogic.sol in https://github.com/hellobloom/core
 */
export default [
  {
    constant: true,
    inputs: [],
    name: 'initializing',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'tokenEscrowMarketplace',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'initializer',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [],
    name: 'endInitialization',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'bytes32',
      },
    ],
    name: 'usedSignatures',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        name: '_initializer',
        type: 'address',
      },
      {
        name: '_tokenEscrowMarketplace',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'subject',
        type: 'address',
      },
      {
        indexed: false,
        name: 'attester',
        type: 'address',
      },
      {
        indexed: false,
        name: 'requester',
        type: 'address',
      },
      {
        indexed: false,
        name: 'dataHash',
        type: 'bytes32',
      },
    ],
    name: 'TraitAttested',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'attester',
        type: 'address',
      },
      {
        indexed: true,
        name: 'requester',
        type: 'address',
      },
    ],
    name: 'AttestationRejected',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'link',
        type: 'bytes32',
      },
      {
        indexed: false,
        name: 'attester',
        type: 'address',
      },
    ],
    name: 'AttestationRevoked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'oldTokenEscrowMarketplace',
        type: 'address',
      },
      {
        indexed: false,
        name: 'newTokenEscrowMarketplace',
        type: 'address',
      },
    ],
    name: 'TokenEscrowMarketplaceChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [],
    name: 'InitializationEnded',
    type: 'event',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_subject',
        type: 'address',
      },
      {
        name: '_requester',
        type: 'address',
      },
      {
        name: '_reward',
        type: 'uint256',
      },
      {
        name: '_requesterSig',
        type: 'bytes',
      },
      {
        name: '_dataHash',
        type: 'bytes32',
      },
      {
        name: '_requestNonce',
        type: 'bytes32',
      },
      {
        name: '_subjectSig',
        type: 'bytes',
      },
    ],
    name: 'attest',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_subject',
        type: 'address',
      },
      {
        name: '_attester',
        type: 'address',
      },
      {
        name: '_requester',
        type: 'address',
      },
      {
        name: '_reward',
        type: 'uint256',
      },
      {
        name: '_requesterSig',
        type: 'bytes',
      },
      {
        name: '_dataHash',
        type: 'bytes32',
      },
      {
        name: '_requestNonce',
        type: 'bytes32',
      },
      {
        name: '_subjectSig',
        type: 'bytes',
      },
      {
        name: '_delegationSig',
        type: 'bytes',
      },
    ],
    name: 'attestFor',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_requester',
        type: 'address',
      },
      {
        name: '_reward',
        type: 'uint256',
      },
      {
        name: '_requestNonce',
        type: 'bytes32',
      },
      {
        name: '_requesterSig',
        type: 'bytes',
      },
    ],
    name: 'contest',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_attester',
        type: 'address',
      },
      {
        name: '_requester',
        type: 'address',
      },
      {
        name: '_reward',
        type: 'uint256',
      },
      {
        name: '_requestNonce',
        type: 'bytes32',
      },
      {
        name: '_requesterSig',
        type: 'bytes',
      },
      {
        name: '_delegationSig',
        type: 'bytes',
      },
    ],
    name: 'contestFor',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_requester',
        type: 'address',
      },
      {
        name: '_attester',
        type: 'address',
      },
      {
        name: '_subject',
        type: 'address',
      },
      {
        name: '_dataHash',
        type: 'bytes32',
      },
    ],
    name: 'migrateAttestation',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_link',
        type: 'bytes32',
      },
    ],
    name: 'revokeAttestation',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_sender',
        type: 'address',
      },
      {
        name: '_link',
        type: 'bytes32',
      },
      {
        name: '_nonce',
        type: 'bytes32',
      },
      {
        name: '_delegationSig',
        type: 'bytes',
      },
    ],
    name: 'revokeAttestationFor',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_newTokenEscrowMarketplace',
        type: 'address',
      },
    ],
    name: 'setTokenEscrowMarketplace',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
