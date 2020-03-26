---
id: phone
title: Phone VCs
hide_title: false
---

# Phone VCs

VCs for validated telephone numbers.


### VCSPhonePerson

credentialSubject type of standard `Person` specifying their telephone number(s). 

| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'Person' | true |  |
| telephone |  string | true |  |

### VCSPhoneOrganization

credentialSubject type of standard `Organization` specifying their telephone number(s). 


| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'Organization' | true |  |
| telephone |  string | true |  |

### VCPhonePerson

Type expanding VCSPhonePerson credentialSubject into a VC.

### VCPhoneOrganization

Type expanding VCSPhoneOrganization credentialSubject into a VC.

