---
id: full-example
title: Full Example
hide_title: true
---

# Full Example

Below is a full example of requesting a user share their credentials with your server.

For a demo visit our [VC Sandbox](https://sandbox.bloom.co).

## Server

```ts
import {RequestData, RequestPayloadData} from '@bloomprotocol/share-kit'
import {uuid} from 'uuidv4'

app.get('/api/share-kit/get-token', function(req, res) {
  const token = uuid()
  const requestPayloadData: RequestPayloadData = {
    version: 1,
    // Enforce that all attestations come from a specified attester
    attesterWhitelist: ['0x123...'],
    types: [
      {
        // Enforce that this attestation came from an ID document (acuant)
        name: 'full-name',
        providerWhitelist: ['acuant'],
      },
      {
        name: 'phone',
        completedAfter: dayjs()
          .subtract(1, 'year')
          .toISOString(),
        // Enfoce that this attestation comes from a different specified attester
        attesterWhitelist: ['0x456...'],
      },
      'email',
      {
        name: 'address',
        optional: true,
      },
    ],
    orgLogoUrl: 'https://mysite.com/images/my-logo.png',
    orgName: 'My Site',
    orgUsagePolicyUrl: 'https://mysite.com/legal/terms',
    orgPrivacyPolicyUrl: 'https://mysite.com/legal/privacy',
  }

  storeRequestPayloadDataForToken(token, requestPayloadData)

  res.json({token})
})

app.get('/api/share-kit/payload/:token', function(req, res) {
  const token = req.params.token

  const requestPayloadData: RequestPayloadData = getRequestPayloadDataForToken(token)

  res.json(requestPayloadData)
})
```

## Client

```ts
import {renderRequestElement, RequestData, QROptions, Action, ButtonOptions} from '@bloomprotocol/share-kit'

const res = await fetch('/api/share-kit/get-token')
const json = await res.json()
const {token} = json

const requestData: RequestData = {
  version: 1,
  responseVersion: 1,
  action: 'credential',
  token: token,
  url: `https://mysite.com/api/share-kit/receive/${token}`,
  payloadUrl: `https://mysite.com/api/share-kit/payload/${token}`,
}
const qrOptions: Partial<QROptions> = {
  size: 200,
}
const buttonOptions: ButtonOptions = {
  callbackUrl: `https://mysite.com/share-kit/callback/${token}`,
}

const container = document.createElement('div')

const {update, remove} = renderRequestElement({container, requestData, qrOptions, buttonOptions})
```
