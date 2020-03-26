---
id: email
title: Email VCs
hide_title: false
---


### VCSEmailPerson

credentialSubject type mapping email(s) to a `Person`.

| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'Person' | true |  |
| email |  MaybeArray&lt;string&gt; | true |  |

### VCSEmailOrganization

credentialSubject type mapping email(s) to an `Organization`.

| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'Organization' | true |  |
| email |  MaybeArray&lt;string&gt; | true |  |

### VCEmailPerson

Type expanding VCSEmailPerson credentialSubject into a VC.

### VCEmailOrganization

Type expanding VCSEmailOrganization credentialSubject into a VC.

