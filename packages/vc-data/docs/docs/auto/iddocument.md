---
id: iddocument
title: Iddocument VCs
hide_title: false
---


### TDocumentClass
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
|  |   or 'unknown' | true |  |
|  |   or 'passport' | true |  |
|  |   or 'visa' | true |  |
|  |   or 'drivers_license' | true |  |
|  |   or 'identification_card' | true |  |
|  |   or 'permit' | true |  |
|  |   or 'currency' | true |  |
|  |   or 'residence_document' | true |  |
|  |   or 'travel_document' | true |  |
|  |   or 'birth_certificate' | true |  |
|  |   or 'vehicle_registration' | true |  |
|  |   or 'other' | true |  |
|  |   or 'weapon_license' | true |  |
|  |   or 'tribal_identification' | true |  |
|  |   or 'voter_identification' | true |  |
|  |   or 'military' | true |  |


### IDDocument
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'IDDocument' | true |  |
| issuer |  GovernmentOrg | true |  |
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
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'IDDocumentRole' | true |  |
| authenticationResult |  string | false |  |
| selfieImage |  string | false |  |
| faceMatch |  MaybeArray<FaceMatch> | false |  |
| hasIDDocument |  MaybeArray<IDDocument> | true |  |

### FaceMatch
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'IDDocumentFaceMatch' | true |  |
| isMatch |  boolean | false |  |
| score |  number | false |  |
| identifier |  number | false |  |


### VCSIDDocPerson
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'Person' | true |  |
| age |  number | false |  |
| birthDate |  TDate | false |  |
| familyName |  string | false |  |
| givenName |  string | false |  |
| gender |  MaybeArray<GenderType or string> | false |  |
| name |  MaybeArray<string> | false |  |
| nationality |  MaybeArray<Country> | false |  |
| hasIDDocument |  MaybeArray<IDDocumentRole> | true |  |

### VCIDDocPerson
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
