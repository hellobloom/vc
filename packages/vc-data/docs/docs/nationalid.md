---
id: nationalid
title: National ID VCs
hide_title: false
---

# SSN/National ID number VCs

VCs documenting a `Person`'s national ID number (e.g., U.S. "Social Security" number) or other similar government-issued identifiers.

### NatPropertyValue

Standard base `PropertyValue` with required attributes.

| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'PropertyValue' | true |  |
| propertyID |  string | true |  |
| value |  string or number | true |  |


### NationalityRole

Extension of `Role` providing meta-information about an individual's nationality, such as national ID numbers.

| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'NationalityRole' | true |  |
| nationality |  GovernmentOrg | true |  |
| identifier |  NatPropertyValue | true |  |

### VCSNatIDNumPerson

credentialSubject type mapping a `Person` to a `NationalityRole`.  

| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'Person' | true |  |
| nationality |  NationalityRole | true |  |


### VCNatIDNumPerson

Type expanding VCSNatIDPerson credentialSubject into a VC.

