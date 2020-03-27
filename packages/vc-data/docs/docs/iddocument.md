---
id: iddocument
title: ID Document VCs
hide_title: false
---

# ID Document types

Types relating to an individual's possession/verification against an ID document.

### TDocumentClass

Possible document classes.

```
export type TDocumentClass =
  | 'unknown'
  | 'passport'
  | 'visa'
  | 'drivers_license'
  | 'identification_card'
  | 'permit'
  | 'currency'
  | 'residence_document'
  | 'travel_document'
  | 'birth_certificate'
  | 'vehicle_registration'
  | 'other'
  | 'weapon_license'
  | 'tribal_identification'
  | 'voter_identification'
  | 'military'
```

### IDDocument

Generic ID document type.

| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'IDDocument' | true |  |
| issuer | GovernmentOrg | false | |
| documentType |  string | false |  |
| issueDate |  TDate | false |  |
| issueType |  string | false |  |
| expirationDate |  TDate | false |  |
| classificationMethod |  'automatic' or 'manual' | false |  |
| idClass |  TDocumentClass | true |  |
| idClassName |  string | false |  |
| countryCode |  string | false |  |
| frontImage |  string | false |  |
| backImage |  string | false |  |
| generic |  boolean | false |  |
| keesingCode |  string | false |  |


### IDDocumentRole

Extension of Role with extensions pertaining to correlating an `IDDocument` to a `Person`.

| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'IDDocumentRole' | true |  |
| authenticationResult |  string | false |  |
| selfieImage |  string | false |  |
| faceMatch |  MaybeArray&lt;FaceMatch&gt; | false |  |
| hasIDDocument |  MaybeArray&lt;IDDocument&gt; | true |  |

### FaceMatch

Type for face/document similarity/comparison result.

| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'IDDocumentFaceMatch' | true |  |
| isMatch |  boolean | false |  |
| score |  number | false |  |
| identifier |  number | false |  |


### VCSIDDocPerson

credentialSubject of standard `Person` type with extension specifying ownership of `IDDocument`.

| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'Person' | true |  |
| age |  number | false |  |
| birthDate |  TDate | false |  |
| familyName |  string | false |  |
| givenName |  string | false |  |
| gender |  MaybeArray&lt;GenderType or string&gt; | false |  |
| name |  MaybeArray&lt;string&gt; | false |  |
| nationality |  MaybeArray&lt;Country&gt; | false |  |
| hasIDDocument |  MaybeArray&lt;IDDocumentRole&gt; | true |  |

### VCIDDocPerson

Type expanding VCSIDDocPerson credentialSubject into a VC.


