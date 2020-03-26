---
id: base
title: Base types
hide_title: false
---

![Base types]

This document describes several schema.org-extending types that are referenced across many of the VC credentialSubject types.  These are intermediate types which primarily are used in the Typescript implementation of vc-data, and may not need to be used directly by an implementing application.

### MaybeArray

Most schema.org types allow for a relationship between two types to be one-to-one or one-to-many - MaybeArray is simple an application-local Typescript helper to facilitate encoding this.

### GovernmentOrg 

The GovernmentOrg type is meant to encapsulate any variety of government organization, corresponding to a union of:

 - [Country](https://schema.org/Country)
 - [State](https://schema.org/State)
 - [City](https://schema.org/City)
 - [Organization](https://schema.org/Organization)
 - [Corporation](https://schema.org/Corporation)
 - [GovernmentOrganization](https://schema.org/GovernmentOrganization)
 - [AdministrativeArea](https://schema.org/AdministrativeArea) 

### MonetaryAmountR

Extension of the schema.org [MonetaryAmount](https://schema.org/MonetaryAmount) type, with the existing attributes "currency" and "value" no longer optional.

### EmployeeRoleOrganization

Extension of the schema.org [Role](https://schema.org/Role) with additional attributes to describe the relationship between an employing [Organization](https://schema.org/Organization) and Employee ([Person](https://schema.org/Person)).

### OrganizationE

The OrganizationE type describes a few recommended attributes, restricts some of their target types, and adds several useful and optional attributes to the base [Organization](https://schema.org/Organization) type:

| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type | 'Organization' | Yes | Base type description, required |
| name | string | No | |
| address | MaybeArray<PostalAddress> | No | | 
| legalName | string | No | 
| dissolutionDate | string | No | |
| hasCredential | MaybeArray<CredentialU> | No | Any credentials assignable to an organization - incompatible extension of the schema.org "hasCredential", which restricts the original credential to [EducationalOccupationalCredential](EducationalOccupationalCredential). |
| telephone | string | No | |
| faxNumber | string | No | |
| email | string | No | |
| website | MaybeArray<WebSite> | No | More definitive replacement for "subjectOf" attribute. |


## CredentialU

Not to be confused with a VerifiableCredential, the "Credential" types describe conventional credentials such as legal documents, certifications, etc..  Currently implemented as a union type (either or) of "OrganizationalCredential", "EducationalOccupationalCredential", or "Credential".  "Credential" should be used in most cases unless a more specific replacement is explicitly named.  The base schema.org types have only an "EducationalOccupationalCredential" inheriting from a much more general "CreativeWork", so an intermediate type was needed.  

## Credential

Meant for describing the incorporation of a business.  Uses the base Credential @type but extends it with `credentialCategory`.


| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type | 'Credential' | Yes | Base type description, required |
| credentialCategory | 'organizational' | No | Type of the credential |
| additionalType | string | No |  |
| dateCreated | string | No | Date of issue/creation |
| datePublished | string | No | Date of publication |
| recognizedBy | MaybeArray<GovernmentOrg> | No | The recognizing authority, such as a government entity |


## OrganizationalCredential

Extends `Credential` for credentials issued to Organizations, generally by governmental entities.  Examples may include incorporation, foreign registration, legal filings, etc.. 

| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| 
| credentialCategory | string | Yes | 'incorporation', 'foreign-registration', 'bankruptcy', etc. |
| organizationType | string or DefinedTerm | No | Organization type (e.g., "s-corp", "llc", "non-profit"), potentially a DefinedTerm via the recognizing authority |
| goodStanding | boolean | No | Company is in "good standing" with the recognizing authority |
| active | boolean | // Company has "active" status within recognizing authority's jurisdiction |
| identifier | PropertyValue, string or number | No (but recommended) | E.g., taxId, can be a URI for specific schemes such as organizational tax IDs, or equivalent PropertyValue.  Otherwise is determined to be a non-ambiguous identifier with the recognizing authority, possibly including a URI. |
| primaryJurisdiction | boolean | no | In the case of incorporation, registration, or others, may be used to indicate the recognizing authority is not the primary jurisdiction in which the organization is recognized. | 
