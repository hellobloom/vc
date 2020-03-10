# Attestations Commons Kit

Shared types and utility functions for attestation related kits

- [Attestations Commons Kit](#attestations-commons-kit)
  - [Installation](#installation)
  - [Extrator](#extractor)
  - [AttestationData](#attestationdata)
  - [AttestationTypes](#attestationtypes)
  - [EthUtils](#ethutils)
  - [Utils](#utils)
  - [RFC3339 DateTime](#RFC3339-datetime)
  - [Validation](#validation)
  - [Types](#types)
    - [Verifiable Credential](#verifiable-credential)
    - [Credential Subject](#credential-subject)
    - [Authorization](#authorization)
    - [Credential Proof](#credential-proof)
    - [Verified Data](#verified-data)
    - [Batch Proof](#batch-proof)
    - [On Chain Proof](#on-chain-proof)
    - [Legacy Proof](#legacy-proof)
    - [Signed Claim Node](#signed-claim-node)
    - [Issued Claim Node](#issued-claim-node)
    - [Issuance Node](#issuance-node)
    - [Legacy Data Node](#legacy-data-node)
    - [Legacy Attestation Node](#legacy-attestation-node)
    - [Merkle Proof](#merkle-proof)
    - [Presentation Proof](#presentation-proof)

## Installation

```
npm install --save @bloomprotocol/att-comm-kit
```

## Extrator

The `extractor` function helps extract data from a verifiable credential.

```typescript
import {IVerifiableCredential, extract} from '@bloomprotocol/attestations-common'

const emailCredential: IVerifiableCredential = {...}

const emailData = extract(emailCredential.credentialSubject.data, 'email', 'email')
```

## AttestationData

```typescript
import {AttestationDataV0} from '@bloomprotocol/attestations-common'
```

We define some extensible interfaces that the attestation data will be formatted in. These are use when extracting the data from the VC.

## EthUtils

Utilty functions for dealing with ethereum and general crypto

## Utils

General purpose utily functions

## RFC3339 DateTime

## Validation

## Types

Types for Verifiable Presentations, Verifiable Credentials, and Verifiable Auth

### Verifiable Credential

Format of a users verified credential

| Name              | Description                                                            | Type                  |
| ----------------- | ---------------------------------------------------------------------- | --------------------- |
| id                | Identifier for this credential                                         | \`string\`            |
| type              | Type name of the credential                                            | \`string\`            |
| issuer            | Identifier of the entity that issued the credential                    | \`string\`            |
| issuanceDate      | RFC3339 Datetime of when the credential was issued                     | \`string\`            |
| credentialSubject | Information about the subject of the credential and the verified data  | \`CredentialSubject\` |
| proof             | Credential proof showing the issuer signed the credential being shared | \`CredentialProof\`   |

### Credential Subject

Information identifying the subject and data of the credential

| Name          | Description                                                                                                  | Type                |
| ------------- | ------------------------------------------------------------------------------------------------------------ | ------------------- |
| subject       | Identifier of original subject of the attestation (Eth Address/ DID)                                         | \`string\`          |
| data          | Stringified data containing what was verified and approved for sharing                                       | \`string\`          |
| authorization | Optional array of signatures showing chain of custody between original credential subject and current holder | \`Authorization[]\` |

### Authorization

Optional array of signatures showing chain of custody between original credential subject and current holder

| Name       | Description                                                      | Type       |
| ---------- | ---------------------------------------------------------------- | ---------- |
| subject    | Address of keypair granting authorization                        | \`string\` |
| recipient  | Address of keypair receiving authorization                       | \`string\` |
| revocation | Hex string to identify this authorization in event of revocation | \`string\` |
| signature  | Hash of subject, recipient, revocation signed by subject pk      | \`string\` |

### Credential Proof

Information identifying the subject and data of the credential

| Name    | Description                                                                    | Type             |
| ------- | ------------------------------------------------------------------------------ | ---------------- |
| type    | Identifier of this proof type                                                  | \`string\`       |
| created | RFC3339 Datetime of when this proof was created. Usually same as issuance date | \`string\`       |
| creator | Identifier of attester. Eth address or DID                                     | \`string\`       |
| data    | Proof object containing all data necessary to validate original attestation    | \`VerifiedData\` |

### Verified Data

Proof defined by the [Selective Disclosure Merkle Tree Spec](https://github.com/hellobloom/specs/blob/master/attestation-data/Bloom-Merkle-Tree-22facf0b-bedb-4b45-bb7d-edcd57213eb0.md)

There are three types of Verified Data proofs in the spec

| Name           | Description                                                                                               |
| -------------- | --------------------------------------------------------------------------------------------------------- |
| Batch Proof    | Proof structure which enables submitting batches of attestations at the same time in a single transaction |
| On Chain Proof | Proof structure intended for use with the AttestationLogic smart contract                                 |
| Legacy Proof   | Legacy proof structure similar to On Chain proof. Used with Attestation Logic smart contract              |

This [linked diagram](https://github.com/hellobloom/specs/blob/master/attestation-data/Combined_Merkle_Tree.png) shows how the proof data structures are formed

### Batch Proof

| Name             | Description                                                      | Type                |
| ---------------- | ---------------------------------------------------------------- | ------------------- |
| version          | Identifier of this proof type                                    | \`string\`          |
| batchLayer2Hash  | Attestation hash formed by hashing subject sig with attester sig | \`string\`          |
| batchAttesterSig | Attester's signature of layer2Hash and subject address           | \`string\`          |
| subjectSig       | Subject signature of attestation agreement                       | \`string\`          |
| requestNonce     | Nonce used in subjectSig                                         | \`string\`          |
| layer2Hash       | Hash of rootHash and rootHashNonce                               | \`string\`          |
| rootHash         | Merkle tree root hash                                            | \`string\`          |
| rootHashNonce    | Nonce used with rootHash to create layer2Hash                    | \`string\`          |
| proof            | Array of merkle proof objects                                    | \`MerkleProof\`     |
| stage            | mainnet, rinkeby, local, etc                                     | \`string\`          |
| target           | Node of the merkle tree being shared                             | \`SignedClaimNode\` |
| attester         | Attester Eth address                                             | \`string\`          |
| subject          | Subject Eth address                                              | \`string\`          |

### On Chain Proof

| Name          | Description                                           | Type                |
| ------------- | ----------------------------------------------------- | ------------------- |
| version       | Identifier of this proof type                         | \`string\`          |
| tx            | Ethereum transaction which refrences this attestation | \`string\`          |
| layer2Hash    | Hash of rootHash and rootHashNonce                    | \`string\`          |
| rootHash      | Merkle tree root hash                                 | \`string\`          |
| rootHashNonce | Nonce used with rootHash to create layer2Hash         | \`string\`          |
| proof         | Array of merkle proof objects                         | \`MerkleProof\`     |
| stage         | mainnet, rinkeby, local, etc                          | \`string\`          |
| target        | Node of the merkle tree being shared                  | \`SignedClaimNode\` |
| attester      | Attester Eth address                                  | \`string\`          |

### Legacy Proof

| Name          | Description                                           | Type               |
| ------------- | ----------------------------------------------------- | ------------------ |
| version       | Identifier of this proof type                         | \`string\`         |
| tx            | Ethereum transaction which refrences this attestation | \`string\`         |
| layer2Hash    | Hash of rootHash and rootHashNonce                    | \`string\`         |
| rootHash      | Merkle tree root hash                                 | \`string\`         |
| rootHashNonce | Nonce used with rootHash to create layer2Hash         | \`string\`         |
| proof         | Array of merkle proof objects                         | \`MerkleProof\`    |
| stage         | mainnet, rinkeby, local, etc                          | \`string\`         |
| target        | Node of the merkle tree being shared                  | \`LegacyDataNode\` |
| attester      | Attester Eth address                                  | \`string\`         |

### Signed Claim Node

Format of target attestation data

| Name        | Description                                                          | Type                |
| ----------- | -------------------------------------------------------------------- | ------------------- |
| claimNode   | Object representing the attestation data, type, and revocation links | \`IssuedClaimNode\` |
| attester    | Attester Eth address                                                 | \`string\`          |
| attesterSig | Root hash of claim node tree signed by attester                      | \`string\`          |

### Issued Claim Node

Format of attestation node

| Name     | Description                                                                    | Type                |
| -------- | ------------------------------------------------------------------------------ | ------------------- |
| data     | Object containing the data, nonce, and version of the attestation              | \`AttestationData\` |
| type     | Object containing he type, nonce, and optionally a provider of the attestation | \`AttestationType\` |
| aux      | String containing a hash of an \`IAuxSig\` object or just a padding node hash  | \`string\`          |
| issuance | Object containing issuance and revocation metadata                             | \`IssuanceNode\`    |

### Issuance Node

| Name                  | Description                                                                           | Type       |
| --------------------- | ------------------------------------------------------------------------------------- | ---------- |
| localRevocationToken  | Hex string to be used in public revocation registry to revoke this data node          | \`string\` |
| globalRevocationToken | Hex string to be used in public revocation registry to revoke this entire attestation | \`string\` |
| dataHash              | Hash of claim tree                                                                    | \`string\` |
| typeHash              | Hash of type object                                                                   | \`string\` |
| issuanceDate          | RFC3339 datetime of when this claim was issued                                        | \`string\` |
| expirationDate        | RFC3339 datetime of when this claim should be considered expired                      | \`string\` |

### Legacy Data Node

Format of legacy attestation data

| Name              | Description                                                          | Type                      |
| ----------------- | -------------------------------------------------------------------- | ------------------------- |
| attestationNode   | Object representing the attestation data, type, and revocation links | \`LegacyAttestationNode\` |
| signedAttestation | Root hash of attestation tree signed by attester                     | \`string\`                |

### Legacy Attestation Node

| Name | Description                                                                      | Type                |
| ---- | -------------------------------------------------------------------------------- | ------------------- |
| data | Object containing the data, nonce, and version of the attestation                | \`AttestationData\` |
| type | Object containing he type, nonce, and optionally a provider of the attestation   | \`AttestationType\` |
| aux  | String containing a hash of an \`IAuxSig\` object or just a padding node hash    | \`string\`          |
| link | Object containing the information used in the event of an attestation revocation | \`RevocationLinks\` |

### Merkle Proof

Format of proof object used to perform merkle proof

| Name     | Description                                                      | Type       |
| -------- | ---------------------------------------------------------------- | ---------- |
| position | \`left\` or \`right\` indicating position of hash in merkle tree | \`string\` |
| data     | Hex string of node hash                                          | \`string\` |

### Presentation Proof

Format of a users verified data

| Name           | Description                                                     | Type       |
| -------------- | --------------------------------------------------------------- | ---------- |
| type           | Identifier of this type of presentation proof                   | \`string\` |
| created        | RFC3339 datetime of when this proof was generated and signed    | \`string\` |
| creator        | Identifier of holder sharing the credential. Eth address or DID | \`string\` |
| nonce          | Token used to make this request unique                          | \`string\` |
| domain         | Website of recipient where user intends to share the data       | \`string\` |
| credentialHash | Hash of array of layer2Hashes being shared                      | \`string\` |

### Authentication Proof

Format of a users verified data

| Name    | Description                                                     | Type       |
| ------- | --------------------------------------------------------------- | ---------- |
| type    | Identifier of this type of presentation proof                   | \`string\` |
| created | RFC3339 datetime of when this proof was generated and signed    | \`string\` |
| creator | Identifier of holder sharing the credential. Eth address or DID | \`string\` |
| nonce   | Token used to make this request unique                          | \`string\` |
| domain  | Website of recipient where user intends to share the data       | \`string\` |

## AttestationTypes

Some helper types and functions for dealing with attestation types ('email', 'phone', 'pep', etc.)
