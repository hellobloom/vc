---
id: request-data
title: Request Data
hide_title: true
---

# RequestData

Data to be rendered into the request element.

QR codes can only contain so much data so instead of providing all the data to Share Kit directly you provide a `payload_url` that returns the necessary information.

## Version 1

| Name        | Description                                                                                     | Type     |
| ----------- | ----------------------------------------------------------------------------------------------- | -------- |
| version     | The version of the request data structure                                                       | `1`      |
| token       | Unique string to identify this data request                                                     | `string` |
| url         | The API endpoint to POST the `ResponseData` to.<br/> See [below](#appending-to-URL) for details | `string` |
| payload_url | The url the user's app will GET `RequestPayloadData` from                                       | `string` |

### Appending to URL

The user can share by tapping a button or scanning a QR code, sometimes you'll need to know the difference so the query param `share-kit-from` is appended to your url.

The param will either be `share-kit-from=qr` OR `share-kit-from=button`.

```diff
- 'https://mysite.com/api/share-kit/receive'
+ 'https://mysite.com/api/share-kit/receive?share-kit-from=qr'
```

Works if your url already has a query param too!

```diff
- 'https://mysite.com/api/share-kit/receive?my-param='
+ 'https://mysite.com/api/share-kit/receive?my-param=&share-kit-from=qr'
```

### RequestPayloadData

The rest of the data necessary for sharing verified data.

#### Version 1

| Name                   | Description                                                        | Type     |
| ---------------------- | ------------------------------------------------------------------ | -------- |
| version                | The version of the payload data                                    | `1`      |
| org_logo_url           | A url of the logo to display to the user when requesting data      | `string` |
| org_name               | The name of the organization requesting data                       | `string` |
| org_usage_policy_url   | The url of the usage policy for the organization requesting data   | `string` |
| org_privacy_policy_url | The url of the privacy policy for the organization requesting data | `string` |

##### Attestation

In addition to [above](#version-1)

| Name             | Description                                              | Type              | Required |
| ---------------- | -------------------------------------------------------- | ----------------- | -------- |
| action           | The action to take                                       | `attestation`     | Y        |
| types            | The type of credentials required and the amount needed   | See [here](types) | Y        |
| issuer_whitelist | List of issuer DIDs to accept any attestation from       | `string[]`        | N        |
| issuer_blacklist | List of issuer DIDs to _not_ accept any attestation from | `string[]`        | N        |

```ts
const requestPayloadData: RequestPayloadData = {
  version: 1,
  org_logo_url: 'https://mysite.com/images/my-logo.png',
  org_name: 'My Site',
  org_usage_policy_url: 'https://mysite.com/legal/terms',
  org_privacy_policy_url: 'https://mysite.com/legal/privacy',
  // Enforce that all credentials come from a specified issuer
  attester_whitelist: ['did:element:...'],
  types: [],
}
```

##### Authentication

In addition to [above](#version-1)

| Name   | Description        | Type             |
| ------ | ------------------ | ---------------- |
| action | The action to take | `authentication` |
