---
id: name
title: Name VCs
hide_title: false
---

# Name VCs

Name of a person or organization.

### VCSNamePerson

credentialSubject type of standard `Person` specifying their name(s). 

| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'Person' | true |  |
| name |  MaybeArray<string> | true |  |

### VCSNameOrganization

credentialSubject type of standard `Organization` specifying their name(s). 


| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'Organization' | true |  |
| name |  MaybeArray<string> | true |  |

### VCNamePerson

Type expanding VCSNamePerson credentialSubject into a VC.

### VCNameOrganization

Type expanding VCSNameOrganization credentialSubject into a VC.

