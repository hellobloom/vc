---
id: full-example
title: Full Example
hide_title: true
---

# Full Example

Below is a full example of requesting a user share their credentials with your server

## Server

```ts
import {RequestData, RequestPayloadData} from '@bloomprotocol/share-kit'
import {uuid} from 'uuidv4'

app.get('/api/share-kit/get-token', function(req, res) {
  const token = uuid()
  const requestPayloadData: RequestPayloadData = {
    version: 1,
    // Enforce that all attestations come from a specified attester
    attester_whitelist: ['0x123...'],
    types: [
      {
        // Enforce that this attestation came from an ID document (acuant)
        name: 'full-name',
        provider_whitelist: ['acuant'],
      },
      {
        name: 'phone',
        completed_after: dayjs()
          .subtract(1, 'year')
          .toISOString(),
        // Enfoce that this attestation comes from a different specified attester
        attester_whitelist: ['0x456...'],
      },
      'email',
      {
        name: 'address',
        optional: true,
      },
    ],
    org_logo_url: 'https://mysite.com/images/my-logo.png',
    org_name: 'My Site',
    org_usage_policy_url: 'https://mysite.com/legal/terms',
    org_privacy_policy_url: 'https://mysite.com/legal/privacy',
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
  token: token,
  url: `https://mysite.com/api/share-kit/receive/${token}`,
  payload_url: `https://mysite.com/api/share-kit/payload/${token}`,
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
