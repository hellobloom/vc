---
id: meta
title: Meta VCs
hide_title: false
---

|  |  | true |  |
|  |  | true |  Meta/aggregation |
|  |  | true |  |

### ReceivedCredentialRole
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'ReceivedCredentialRole' | true |  |
| startDate |  string | false |  |
| endDate |  string | false |  |
| aggregatorDID |  string | false |  |
| typesSome |  Array<string> | false |  |
| typesAll |  Array<string> | false |  |
| typesNot |  Array<string> | false |  |
| contextsSome |  Array<string> | false |  |
| contextsAll |  Array<string> | false |  |
| contextsNot |  Array<string> | false |  |
| issuerDIDIn |  Array<string> | false |  |
| issuerDIDNotIn |  Array<string> | false |  |
| receivedCredentials |  MaybeArray<string or VCV1> | true |  |

### VCSMetaPerson
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'Person' | true |  |
| receivedCredentials |  MaybeArray<ReceivedCredentialRole> | true |  |

### VCSMetaOrganization
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'Organization' | true |  |
| receivedCredentials |  MaybeArray<ReceivedCredentialRole> | true |  |

### VCMetaPerson
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |

### VCMetaOrganization
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
