---
id: base
title: Base VCs
hide_title: false
---
|  | import { | true |  |
|  |   AdministrativeArea, | true |  |
|  |   City, | true |  |
|  |   Corporation, | true |  |
|  |   Country, | true |  |
|  |   DefinedTerm, | true |  |
|  |   GovernmentOrganization, | true |  |
|  |   MonetaryAmount, | true |  |
|  |   Organization, | true |  |
|  |   PostalAddress, | true |  |
|  |   State, | true |  |
|  |   WebSite, | true |  |
|  |   PropertyValue, | true |  |



### Modify<T,
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |

### Extend<T,
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |

### Subject<T
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |


### MaybeArray<T>
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |

|  |  | true |  |
|  |  | true |  schema-dts type extensions |
|  |  | true |  |


### GovernmentOrg
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
|  |   or Country | true |  |
|  |   or State | true |  |
|  |   or City | true |  |
|  |   or Organization | true |  |
|  |   or Corporation | true |  |
|  |   or GovernmentOrganization | true |  |
|  |   or (AdministrativeArea & { | true |  |
| identifier |  'string'  | false |  Issuer code |


### MonetaryAmountR
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| currency |  string | true |  |
| value |  number or string | true |  |


### EmployeeRoleOrganization
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'EmployeeRole' | true |  |
| employeeOf |  OrganizationE | true |  |


### OrganizationE
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'Organization' | true |  |
| name |  string | false |  |
| address |  MaybeArray<PostalAddress> | false |  |
| legalName |  string | false |  |
| dissolutionDate |  string | false |  |
| hasCredential |  MaybeArray<CredentialU> | false |  |
| telephone |  string | false |  |
| faxNumber |  string | false |  |
| email |  string | false |  |
| website |  MaybeArray<WebSite> | false |  |


### CredentialU
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |


### Credential
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'Credential' or string | true |  |
| credentialCategory |  string | false |  |
| additionalType |  string | false |  |
| dateCreated |  string | false |  |
| dateModified |  string | false |  |
| dateRevoked |  string | false |  |
| datePublished |  string | false |  |
| recognizedBy |  MaybeArray<GovernmentOrg> | false |  |


### undefinedOrganizationalCredential
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| credentialCategory |  string  | true |  'incorporation', 'foreign-registration' |
| organizationType |  string or DefinedTerm | false |  |
| goodStanding |  boolean  | false |  Company is in "good standing" with the recognizing authority |
| active |  boolean  | false |  Company has "active" status within recognizing authority's jurisdiction |
| identifier |  PropertyValue or string | number  | false |  e.g., taxId, can be a URI for specific schemes such as organizational tax IDs, or equivalent PropertyValue |
| primaryJurisdiction |  boolean | false |  |
