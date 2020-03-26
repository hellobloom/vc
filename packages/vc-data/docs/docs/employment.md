---
id: employment
title: Employment VCs
hide_title: false
---

# Employment VCs

### EmployeeRolePerson

Extension of schema.org `Role` for employment role/relationship between Person and Organization.

| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'EmployeeRole' | true |  |
| employee |  Person | true |  |

### VCSEmploymentPerson

credentialSubject type relating a `Person` to one or more `EmployeeRolePerson`s.  

| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'Person' | true |  |
| employeeOf |  MaybeArray<EmployeeRoleOrganization> | true |  |

### VCSEmploymentOrganization

credentialSubject type relating an `Organization` to one or more `EmployeeRolePerson`s.  

| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'Organization' | true |  |
| employee |  MaybeArray<EmployeeRolePerson> | true |  |

### VCEmploymentPerson

Type expanding VCSAccountPerson credentialSubject into a VC.

### VCEmploymentOrganization

Type expanding VCSAccountOrganization credentialSubject into a VC.
