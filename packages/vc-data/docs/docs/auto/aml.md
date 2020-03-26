---
id: aml
title: Aml VCs
hide_title: false
---


### BaseAttList
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| name |  string | false |  |
| url |  string | false |  |

### BaseAttHit
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| id |  string | false |  |
| name |  string | false |  |

### AMLSearch
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'AMLSearch' | true |  |
| hitLocation |  string or GovernmentOrg | false |  |
| hitNumber |  number | false |  |
| lists |  Array<BaseAttList> | false |  |
| recordId |  MaybeArray<string> | false |  |
| identifier |  string | false |  |
| score |  string or number | false |  |
| hits |  Array<BaseAttHit> | false |  |
| flagType |  string | false |  |
| comment |  string | false |  |

### VCSAMLPerson
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'Person' | true |  |
| hasAMLSearch |  AMLSearch | true |  |

### VCSAMLOrganization
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'Organization' | true |  |
| hasAMLSearch |  AMLSearch | true |  |

### VCAMLPerson
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |

### VCAMLOrganization
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
