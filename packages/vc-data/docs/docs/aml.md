---
id: aml
title: AML VCs
hide_title: false
---

VCs for the purpose of anti-money-laundering, watchlist VCs, PEP, and related search results/verifications.

## Utility types

### BaseAttList

Specific AML lists searched against

| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| name |  string | false |  |
| url |  string | false |  |

### BaseAttHit

Hit/match for AML search

| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| id |  string | false |  |
| name |  string | false |  |

### AMLSearch

Indicates 

| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'AMLSearch' | true |  |
| hitLocation |  string or GovernmentOrg | false | Location/jurisdiction of hit |
| hitNumber |  number | false | Number of hits |
| lists |  Array<BaseAttList> | false | Lists searched against  |
| recordId | MaybeArray<string> | false | Matching record ID(s) |
| identifier |  string | false | Identifier for the specific search |
| score |  string or number | false | Match score (out of 100) |
| hits |  Array<BaseAttHit> | false |  |
| flagType |  string | false | Type of flag raised on hit |
| comment |  string | false |  |

## VC/credentialSubject types

### VCSAMLPerson

credentialSubject type relating a `Person` to an `AMLSearch`.

| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'Person' | true |  |
| hasAMLSearch |  AMLSearch | true |  |

### VCSAMLOrganization

credentialSubject type relating an `Organization` to an `AMLSearch`.

| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'Organization' | true |  |
| hasAMLSearch |  AMLSearch | true |  |

### VCAMLPerson

Type expanding VCSAMLPerson credentialSubject into a VC.

### VCAMLOrganization

Type expanding VCSAMLOrganization credentialSubject into a VC.

