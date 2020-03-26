---
id: employment
title: Employment VCs
hide_title: false
---


### EmployeeRolePerson
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'EmployeeRole' | true |  |
| employee |  Person | true |  |

### VCSEmploymentPerson
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'Person' | true |  |
| employeeOf |  MaybeArray<EmployeeRoleOrganization> | true |  |

### VCSEmploymentOrganization
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'Organization' | true |  |
| employee |  MaybeArray<EmployeeRolePerson> | true |  |

### VCEmploymentPerson
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |

### VCEmploymentOrganization
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
