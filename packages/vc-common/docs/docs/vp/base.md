---
id: base
title: Base Verifiable Presentation
hide_title: true
---

# Base Verifiable Presentation

## BaseVPV1

The `BaseVPV1` is the object used to transport many VCs to and from interested parties. Based on and compliant with the [VC Data Model](https://www.w3.org/TR/vc-data-model/).

| Name                 | Description                                                 | Type                       | Required? |
| -------------------- | ----------------------------------------------------------- | -------------------------- | --------- |
| @context             | The context(s) to resolve the rest of the VC against        | [`TContext`](#tcontext)    | y         |
| type                 | The type of VP it is, must contain "VerifiablePresentation" | `BaseVPV1Type`             | y         |
| verifiableCredential | The VCs that the VP is transporting                         | [`BaseVCV1[]`](../vc/base) | y         |
| holder               | The holder of the VP, and the transported VCs               | `BaseVPV1Holder`           | y         |

### TContext

Context must be an ordered array that starts with `"https://www.w3.org/2018/credentials/v1"`. The array can contain many URLs to hosted context files or local context objects.

More information on contexts can be found [here](https://w3c.github.io/json-ld-syntax/#the-context).

### BaseVPV1Type

Type must be an array that contains `"VerifiablePresentation"`. You can add any other strings that define the type of presentation it is.

### BaseVPV1Holder

| Name | Description                               | Type     | Required? |
| ---- | ----------------------------------------- | -------- | --------- |
| id   | The DID of the holder of the presentation | `string` | y         |
