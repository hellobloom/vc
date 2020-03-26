---
id: meta
title: Meta VCs
hide_title: false
---

# Meta/aggregation

VCs describing other VCs, useful for aggregation, blind aggregation, auditing, etc..

### ReceivedCredentialRole

Search criteria for received credentials

| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'ReceivedCredentialRole' | true |  |
| startDate |  string | false | First datetime (ISO 8601) of matching VCs, inclusive |
| endDate |  string | false | Last datetime (ISO 8601) of matching VCs, inclusive |
| aggregatorDID |  string | false | Aggregator DID (igenerally, same as issuer DID) |
| typesSome |  Array&lt;string&gt; | false | VC types must have at least one |
| typesAll |  Array&lt;string&gt; | false | VC types must include all |
| typesNot |  Array&lt;string&gt; | false | VC types cannot include |
| contextsSome |  Array&lt;string&gt; | false | VC @contexts must have at least one |
| contextsAll |  Array&lt;string&gt; | false | VC @contexts must include all |
| contextsNot |  Array&lt;string&gt; | false | VC @contexts cannot include |
| issuerDIDIn |  Array&lt;string&gt; | false | Issuer DID whitelist |
| issuerDIDNotIn |  Array&lt;string&gt; | false | Issuer DID blacklist |
| receivedCredentials |  MaybeArray&lt;string or VCV1&gt; | true | Either an anchoring hash or the full VC for each VC in question |

### VCSMetaPerson

credentialSubject type mapping Person to ReceivedCredentialRole.

| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'Person' | true |  |
| receivedCredentials |  MaybeArray&lt;ReceivedCredentialRole&gt; | true |  |

### VCSMetaOrganization

credentialSubject type mapping Organization to ReceivedCredentialRole.

| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'Organization' | true |  |
| receivedCredentials |  MaybeArray&lt;ReceivedCredentialRole&gt; | true |  |

### VCMetaPerson

Type expanding VCSMetaPerson credentialSubject into a VC.

### VCMetaOrganization

Type expanding VCSMetaOrganization credentialSubject into a VC.
