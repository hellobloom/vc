---
id: base
title: Base Verifiable Credential
hide_title: true
---

# Base Verifiable Credential

:::important Important
These types are just a building block and shouldn't be used directly.

You probably want to use [`VC`](index) instead.
:::

## BaseVCV1

The `BaseVCV1` is the un-opinionated builidng block for creating specific types of verifiable credentials. Based on and compliant with the [VC Data Model](https://www.w3.org/TR/vc-data-model/).

| Name              | Description                                                             | Type                                                      | Required? |
| ----------------- | ----------------------------------------------------------------------- | --------------------------------------------------------- | --------- |
| @context          | The context(s) to resolve the rest of the VC against                    | [`TContext`](#TContext)                                   | y         |
| id                | The identifier of the VC, must be a URI.                                | `string`                                                  | y         |
| type              | The type of VC it is, must contain "VerifiableCredential"               | `string | string[]`                                       | y         |
| issuer            | The DID of the issuer                                                   | `string`                                                  | y         |
| issuanceDate      | The timestamp of VC issuance                                            | `string`                                                  | y         |
| expirationDate    | When the VC should be considered invalid                                | `string`                                                  | n         |
| credentialSubject | The claims of the VC                                                    | [`BaseVCV1Subject | BaseVCV1Subject[]`](#BaseVCV1Subject) | y         |
| holder            | The holder of the VC                                                    | [`BaseVCV1Holder`](#BaseVCV1Holder)                       | y         |
| revocation        | Information about how to check if the VC has been revoked by the issuer | [`BaseVCV1Revocation`](#BaseVCV1Revocation)               | n         |
| proof             | The JSON-LD signature of the VC                                         | [`BaseVCV1Proof`](#BaseVCV1Proof)                         | n         |

### TContext

Context must be an ordered array that starts with `"https://www.w3.org/2018/credentials/v1"`. The array can contain many URLs to hosted context files or local context objects.

More information on contexts can be found [here](https://w3c.github.io/json-ld-syntax/#the-context).

### BaseVCV1Subject

| Name | Description                              | Type                        | Required? |
| ---- | ---------------------------------------- | --------------------------- | --------- |
| id   | The DID of the subject of the claim      | `string`                    | n         |
| data | The underlying schema.org data of the VC | `extends {'@type': string}` | y         |

### BaseVCV1Holder

| Name | Description                             | Type     | Required? |
| ---- | --------------------------------------- | -------- | --------- |
| id   | The DID of the holder of the credential | `string` | y         |

### BaseVCV1Type

Type must be an array that contains `"VerifiableCredential"`. You can add any other strings that define the type of credential it is ("UniversityDegreeCredential", "EmploymentCredential", etc.)

### BaseVCV1Proof

:::note Note
The proof is added on once the rest of the VC is completed. It is used to verify the VC when the holder shares it.
:::

| Name               | Description                                                                                  | Type              | Required? |
| ------------------ | -------------------------------------------------------------------------------------------- | ----------------- | --------- |
| type               | The method used for creating the proof                                                       | `string`          | y         |
| created            | The timestamp of when the proof was created                                                  | `string`          | y         |
| proofPurpose       | The purpose of the proof, this is used to check the permissions on the signer's DID document | `assertionMethod` | y         |
| verificationMethod | The signer's DID key that signed the VC (did:element:...#primary)                            | `string`          | y         |
| jws                | The signature string of the VC                                                               | `string`          | y         |

### BaseVCV1Revocation

| Name | Description                                | Type     | Required? |
| ---- | ------------------------------------------ | -------- | --------- |
| id   | The revocation ID of the VC, must be a URI | `string` | y         |
