---
id: dob
title: DOB VCs
hide_title: false
---

# BirthDate

Standard type without extensions, specifying a `Person`'s birthdate.

### VCSDOBPerson

credentialSubject type of standard `Person` specifying their birthdate. 

| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'Person' | true |  |
| birthDate |  string | true |  |

### VCDOBPerson

Type expanding VCSDOBPerson credentialSubject into a VC.
