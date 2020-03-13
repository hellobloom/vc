---
id: credential-types
title: Credential Types
hide_title: true
---

# Credential Types

`types` can be set to a list of `string` or [`DetailedCredentialTypeConfig`](#detailed-credential-type-config).

## DetailedCredentialTypeConfig

Detailed configs allow you to control exactly what credential data you will recieve.

### Version 1

| Name              | Description                                                           | Type       | Required |
| ----------------- | --------------------------------------------------------------------- | ---------- | -------- |
| name              | The name of the credential                                            | `string`   | Y        |
| optional          | Whether the credential is required to be completed                    | `boolean`  | N        |
| completedAfter    | Signifies that the credential has to be completed after a given date  | `string`   | N        |
| completedBefore   | Signifies that the credential has to be completed before a given date | `string`   | N        |
| providerWhitelist | List of provider names to accept an credential from                   | `string[]` | N        |
| providerBlacklist | List of provider names to _not_ accept an credential from             | `string[]` | N        |
| issuerWhitelist   | List of issuer DIDs to accept an credential from                      | `string[]` | N        |
| issuerBlacklist   | List of issuer DIDs to _not_ accept an credential from                | `string[]` | N        |

#### Example

```ts
const configs: DetailedCredentialTypeConfigV1[] = [
  {
    // Enforce that this credential came from an ID document (acuant)
    name: 'full-name',
    providerWhitelist: ['acuant'],
  },
  {
    name: 'phone',
    completedAfter: dayjs()
      .subtract(1, 'year')
      .toISOString(),
    issuerWhitelist: ['did:element:...'],
  },
  'email',
  {
    name: 'address',
    optional: true,
  },
]
```
