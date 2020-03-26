---
id: address
title: Address VCs
hide_title: false
---


### VCSAddressPerson

Standard `Person` type with restriction forcing `PostalAddress` instead of `Text` for `address` attribute.

| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'Person' | true |  |
| address |  MaybeArray&lt;PostalAddress&gt; | true |  |

### VCSAddressOrganization

Standard `Organization` type with restriction forcing `PostalAddress` instead of `Text` for `address` attribute.

| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'Organization' | true |  |
| address |  MaybeArray&lt;PostalAddress&gt; | true |  |

### VCAddressPerson

Type expanding VCSAddressPerson credentialSubject into a VC.

### VCAddressOrganization

Type expanding VCSAddressOrganization credentialSubject into a VC.

