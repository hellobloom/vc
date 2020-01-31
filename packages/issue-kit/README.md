# Issue Kit

Utilities to issue verifiable credentials.

- [Issue Kit](#issue-kit)
  - [Installation](#installation)
  - [Usage](#usage)
    - [`buildClaimNodeV1`](#buildclaimnodev1)
    - [`buildSDVCV1`](#buildselectivelydisclosablevcv1)
    - [`buildSDBatchVCV1`](#buildselectivelydisclosablebatchvcv1)

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

### `buildSDVCV1`

Create a verifiable credential (`SDVCV1`) of selectively discloseable claim nodes.

```typescript
import {VCClaimNodeV1} from '@bloomprotocol/attestations-common'
import {buildSDVCV1} from '@bloomprotocol/issue-kit'

const claimNodes: VCClaimNodeV1[] = [...]
const privateKey = '...'

const credential = buildSDVCV1({
  claimNodes,
  subject,
  issuanceDate: '',
  expirationDate: '',
  privateKey,
})
```

### `buildSDBatchVCV1`

Convert a `SDVCV1` to a `SDBatchVCV1`

```typescript
import {VCClaimNodeV1} from '@bloomprotocol/attestations-common'
import {buildSDVCV1, buildSDBatchVCV1} from '@bloomprotocol/issue-kit'

const claimNodes: VCClaimNodeV1[] = [...]
const privateKey = '...'
const credential = buildSDVCV1({
  claimNodes,
  subject,
  issuanceDate: '',
  expirationDate: '',
  privateKey,
})

// This will likely be split between two separate API endpoints
const subjectSignature = getSubjectsSignatureForCred(credential)

const batchCredential = buildSDBatchVCV1({
  credential,
  contractAddress: '...',
  subjectSignature,
  requestNonce: '', // Not sure what this is for
  privateKey,
})
```
