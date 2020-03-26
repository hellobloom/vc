---
id: gender
title: Gender VCs
hide_title: false
---

# Gender

Standard type without extensions, specifying a `Person`'s gender(s).

### VCSGenderPerson

credentialSubject type of standard `Person` specifying their gender(s). 

| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'Person' | true |  |
| gender |  MaybeArray&lt;GenderType or string&gt; | true |  |

### VCGenderPerson

Type expanding VCSGenderPerson credentialSubject into a VC.
