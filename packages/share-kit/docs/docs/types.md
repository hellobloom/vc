---
id: types
title: Types
hide_title: true
---

# Credential Types

`types` can be set to a list of `string` or [`DetailedCredentialTypeConfig`](#detailed-credential-type-config).

## DetailedCredentialTypeConfig

Detailed configs allow you to control exactly what credential data you will recieve.

### Version 1

| Name               | Description                                                           | Type       | Required |
| ------------------ | --------------------------------------------------------------------- | ---------- | -------- |
| name               | The name of the credential                                            | `string`   | Y        |
| optional           | Whether the credential is required to be completed                    | `boolean`  | N        |
| completed_after    | Signifies that the credential has to be completed after a given date  | `string`   | N        |
| completed_before   | Signifies that the credential has to be completed before a given date | `string`   | N        |
| provider_whitelist | List of provider names to accept an credential from                   | `string[]` | N        |
| provider_blacklist | List of provider names to _not_ accept an credential from             | `string[]` | N        |
| issuer_whitelist   | List of issuer DIDs to accept an credential from                      | `string[]` | N        |
| issuer_blacklist   | List of issuer DIDs to _not_ accept an credential from                | `string[]` | N        |

#### Example

```ts
const configs: DetailedCredentialTypeConfigV1[] = [
  {
    // Enforce that this credential came from an ID document (acuant)
    name: 'full-name',
    provider_whitelist: ['acuant'],
  },
  {
    name: 'phone',
    completed_after: dayjs()
      .subtract(1, 'year')
      .toISOString(),
    issuer_whitelist: ['did:element:...'],
  },
  'email',
  {
    name: 'address',
    optional: true,
  },
]
```
