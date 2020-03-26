---
id: nationalid
title: Nationalid VCs
hide_title: false
---

|  |  | true |  |
|  |  | true |  SSN/National ID number |
|  |  | true |  |


### NatPropertyValue
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'PropertyValue' | true |  |
| propertyID |  string | true |  |
| value |  string or number | true |  |


### NationalityRole
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'NationalityRole' | true |  |
| nationality |  GovernmentOrg | true |  |
| identifier |  NatPropertyValue | true |  |


### VCSNatIDNumPerson
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'Person' | true |  |
| nationality |  NationalityRole | true |  |


### VCSNatIDNumOrganization
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'Organization' | true |  |
| nationality |  NationalityRole | true |  |


### VCNatIDNumPerson
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |

### VCNatIDNumOrganization
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
