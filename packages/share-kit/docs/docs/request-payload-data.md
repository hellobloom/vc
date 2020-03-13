---
id: request-payload-data
title: Request Payload Data
hide_title: true
---

# RequestPayloadData

The rest of the data necessary for sharing verified data.

## Version 1

| Name                | Description                                                        | Type     |
| ------------------- | ------------------------------------------------------------------ | -------- |
| version             | The version of the payload data                                    | `1`      |
| orgLogoUrl          | A url of the logo to display to the user when requesting data      | `string` |
| orgName             | The name of the organization requesting data                       | `string` |
| orgUsagePolicyUrl   | The url of the usage policy for the organization requesting data   | `string` |
| orgPrivacyPolicyUrl | The url of the privacy policy for the organization requesting data | `string` |

### Credential

This is what should be returned from [`RequestData.payloadUrl`](request-data) if `action` is set to 'credential'.

In addition to [above](#version-1) the following fields are added to the type.

| Name            | Description                                              | Type                         | Required |
| --------------- | -------------------------------------------------------- | ---------------------------- | -------- |
| types           | The type of credentials required and the amount needed   | See [here](credential-types) | Y        |
| issuerWhitelist | List of issuer DIDs to accept any attestation from       | `string[]`                   | N        |
| issuerBlacklist | List of issuer DIDs to _not_ accept any attestation from | `string[]`                   | N        |

```ts
const requestPayloadData: RequestPayloadData = {
  version: 1,
  orgLogoUrl: 'https://mysite.com/images/my-logo.png',
  orgName: 'My Site',
  orgUsagePolicyUrl: 'https://mysite.com/legal/terms',
  orgPrivacyPolicyUrl: 'https://mysite.com/legal/privacy',
  // Enforce that all credentials come from a specified issuer
  issuerWhitelist: ['did:element:...'],
  types: [
    ...
  ],
}
```

### Authentication

This is what should be returned from [`RequestData.payloadUrl`](request-data) if `action` is set to 'authentication'.

```ts
const requestPayloadData: RequestPayloadData = {
  version: 1,
  orgLogoUrl: 'https://mysite.com/images/my-logo.png',
  orgName: 'My Site',
  orgUsagePolicyUrl: 'https://mysite.com/legal/terms',
  orgPrivacyPolicyUrl: 'https://mysite.com/legal/privacy',
}
```
