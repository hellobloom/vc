# Issue Kit

Utilities to issue verifiable credentials.

- [Issue Kit](#issue-kit)
  - [Installation](#installation)
  - [Usage](#usage)
    - [`buildClaimNodeV1`](#buildclaimnodev1)
    - [`buildSelectivelyDisclosableVCV1`](#buildselectivelydisclosablevcv1)
    - [`buildSelectivelyDisclosableBatchVCV1`](#buildselectivelydisclosablebatchvcv1)

## Installation

```
npm install --save @bloomprotocol/issue-kit
```

## Usage

### `buildClaimNodeV1`

Create a `VCClaimNodeV1` to be used in a credential

```typescript
import {buildClaimNodeV1} from '@bloomprotocol/issue-kit'

const claimNode = buildClaimNodeV1({
  dataStr: JSON.stringify({...}),
  type: 'phone',
  provider: '',
  version: '3.0.0'
})
```

### `buildSelectivelyDisclosableVCV1`

Create a verifiable credential (`SelectivelyDisclosableVCV1`) of selectively discloseable claim nodes.

```typescript
import {VCClaimNodeV1} from '@bloomprotocol/attestations-common'
import {buildSelectivelyDisclosableVCV1} from '@bloomprotocol/issue-kit'

const claimNodes: VCClaimNodeV1[] = [...]
const privateKey = '...'

const credential = buildSelectivelyDisclosableVCV1({
  claimNodes,
  subject,
  issuanceDate: '',
  expirationDate: '',
  privateKey,
})
```

### `buildSelectivelyDisclosableBatchVCV1`

Convert a `SelectivelyDisclosableVCV1` to a `SelectivelyDisclosableBatchVCV1`

```typescript
import {VCClaimNodeV1} from '@bloomprotocol/attestations-common'
import {buildSelectivelyDisclosableVCV1, buildSelectivelyDisclosableBatchVCV1} from '@bloomprotocol/issue-kit'

const claimNodes: VCClaimNodeV1[] = [...]
const privateKey = '...'
const credential = buildSelectivelyDisclosableVCV1({
  claimNodes,
  subject,
  issuanceDate: '',
  expirationDate: '',
  privateKey,
})

// This will likely be split between two separate API endpoints
const subjectSignature = getSubjectsSignatureForCred(credential)

const batchCredential = buildSelectivelyDisclosableBatchVCV1({
  credential,
  contractAddress: '...',
  subjectSignature,
  requestNonce: '', // Not sure what this is for
  privateKey,
})
```
