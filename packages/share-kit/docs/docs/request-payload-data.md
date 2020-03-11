---
id: request-payload-data
title: Request Payload Data
hide_title: true
---

# RequestPayloadData

The rest of the data necessary for sharing verified data.

## Version 1

| Name                   | Description                                                        | Type     |
| ---------------------- | ------------------------------------------------------------------ | -------- |
| version                | The version of the payload data                                    | `1`      |
| org_logo_url           | A url of the logo to display to the user when requesting data      | `string` |
| org_name               | The name of the organization requesting data                       | `string` |
| org_usage_policy_url   | The url of the usage policy for the organization requesting data   | `string` |
| org_privacy_policy_url | The url of the privacy policy for the organization requesting data | `string` |

### Credential

In addition to [above](#version-1)

| Name             | Description                                              | Type                         | Required |
| ---------------- | -------------------------------------------------------- | ---------------------------- | -------- |
| action           | The action to take                                       | `credential`                 | Y        |
| types            | The type of credentials required and the amount needed   | See [here](credential-types) | Y        |
| issuer_whitelist | List of issuer DIDs to accept any attestation from       | `string[]`                   | N        |
| issuer_blacklist | List of issuer DIDs to _not_ accept any attestation from | `string[]`                   | N        |

```ts
const requestPayloadData: RequestPayloadData = {
  action: 'credential',
  version: 1,
  org_logo_url: 'https://mysite.com/images/my-logo.png',
  org_name: 'My Site',
  org_usage_policy_url: 'https://mysite.com/legal/terms',
  org_privacy_policy_url: 'https://mysite.com/legal/privacy',
  // Enforce that all credentials come from a specified issuer
  issuer_whitelist: ['did:element:...'],
  types: [
    ...
  ],
}
```

### Authentication

In addition to [above](#version-1)

| Name   | Description        | Type             |
| ------ | ------------------ | ---------------- |
| action | The action to take | `authentication` |

```ts
const requestPayloadData: RequestPayloadData = {
  action: 'authentication',
  version: 1,
  org_logo_url: 'https://mysite.com/images/my-logo.png',
  org_name: 'My Site',
  org_usage_policy_url: 'https://mysite.com/legal/terms',
  org_privacy_policy_url: 'https://mysite.com/legal/privacy',
}
```
