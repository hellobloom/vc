import {
  Person,
  Organization,
  Corporation,
  MonetaryAmount,
  Date as TDate,
  GenderType,
  Country,
  GovernmentOrganization,
  State,
  City,
  AdministrativeArea,
  PostalAddress,
  WebSite,
} from 'schema-dts';

import {
  AtomicVCV1,
  AtomicVCSubjectV1,
  SimpleThing,
} from '@bloomprotocol/attestations-common';

export type Modify<T, R> = Pick<T, Exclude<keyof T, keyof R>> & R;
export type Extend<T, R> = Modify<Exclude<T, string>, R>;
export type Subject<T extends SimpleThing | string> = AtomicVCSubjectV1<
  Exclude<T, string>
>;
export type MaybeArray<T> = T | Array<T>;
export type GovernmentOrg =
  | Country
  | State
  | City
  | Organization
  | Corporation
  | GovernmentOrganization
  | (AdministrativeArea & {
      identifier?: 'string'; // Issuer code
    });
//////////////////////////////////////////////////////////////
// Name
//////////////////////////////////////////////////////////////
export interface VCSNamePerson extends Subject<Person> {
  '@type': 'Person';
  name: string;
}
export interface VCSNameOrganization extends Subject<Organization> {
  '@type': 'Organization';
  name: string;
}
export type VCNamePerson = AtomicVCV1<VCSNamePerson>;
export type VCNameOrganization = AtomicVCV1<VCSNameOrganization>;

//////////////////////////////////////////////////////////////
// Phone
//////////////////////////////////////////////////////////////
export interface VCSPhonePerson extends Subject<Person> {
  '@type': 'Person';
  telephone: string;
}
export interface VCSPhoneOrganization extends Subject<Organization> {
  '@type': 'Organization';
  telephone: string;
}
export type VCPhonePerson = AtomicVCV1<VCSPhonePerson>;
export type VCPhoneOrganization = AtomicVCV1<VCSPhoneOrganization>;

//////////////////////////////////////////////////////////////
// Email
//////////////////////////////////////////////////////////////
export interface VCSEmailPerson extends Subject<Person> {
  '@type': 'Person';
  email: string;
}
export interface VCSEmailOrganization extends Subject<Organization> {
  '@type': 'Person';
  email: string;
}
export type VCEmailPerson = AtomicVCV1<VCSEmailPerson>;
export type VCEmailOrganization = AtomicVCV1<VCSEmailOrganization>;

//////////////////////////////////////////////////////////////
// AML (sanction screen/PEP)
//////////////////////////////////////////////////////////////
export interface IBaseAttList {
  name?: string;
  url?: string;
}
export interface IBaseAttHit {
  id?: string;
  hitName?: string;
}
export interface TAMLSearch {
  '@type': 'AMLSearch';
  hitLocation?: string;
  hitNumber?: number;
  lists?: Array<IBaseAttList>;
  recordId?: string;
  searchReferenceId?: string;
  score?: string;
  hits?: Array<IBaseAttHit>;
  flagType?: string;
  comment?: string;
}
export interface VCSAMLPerson extends Subject<Person> {
  '@type': 'Person';
  hasAMLSearch: TAMLSearch;
}
export interface VCSAMLOrganization extends Subject<Organization> {
  '@type': 'Organization';
  hasAMLSearch: TAMLSearch;
}
export type VCAMLPerson = AtomicVCV1<VCSAMLPerson>;
export type VCAMLOrganization = AtomicVCV1<VCSAMLOrganization>;

//////////////////////////////////////////////////////////////
// Account
//////////////////////////////////////////////////////////////
export interface VCSAccountPerson extends Subject<Person> {
  '@type': 'Person';
  email?: string;
  memberOf: {
    '@type': 'Role';
    roleName?: string;
    identifier?: string;
    startDate?: TDate;
    endDate?: TDate;
    memberOf: Organization;
  };
}
export interface VCSAccountOrganization extends Subject<Organization> {
  '@type': 'Organization';
  memberOf: {
    '@type': 'Role';
    roleName?: string;
    identifier?: string;
    startDate?: TDate;
    endDate?: TDate;
    memberOf: Organization;
  };
}
export type VCAccountPerson = AtomicVCV1<VCSAccountPerson>;
export type VCAccountOrganization = AtomicVCV1<VCSAccountOrganization>;

//////////////////////////////////////////////////////////////
// ID document
//////////////////////////////////////////////////////////////

export type TDocumentClass =
  | 'unknown'
  | 'passport'
  | 'visa'
  | 'drivers_license'
  | 'identification_card'
  | 'permit'
  | 'currency'
  | 'residence_document'
  | 'travel_document'
  | 'birth_certificate'
  | 'vehicle_registration'
  | 'other'
  | 'weapon_license'
  | 'tribal_identification'
  | 'voter_identification'
  | 'military';

export interface VCSIDDocPerson extends Subject<Person> {
  '@type': 'Person';
  age?: number;
  birthDate?: TDate;
  familyName?: string;
  givenName?: string;
  gender?: MaybeArray<GenderType | string>;
  name?: MaybeArray<string>;
  nationality?: MaybeArray<Country>;
  hasIDDocument: MaybeArray<{
    '@type': 'IDDocumentRole';
    authenticationResult?: string;
    selfieImage?: string;
    faceMatch?: MaybeArray<{
      '@type': 'IDDocumentFaceMatch';
      isMatch?: boolean;
      score?: number;
      identifier?: number;
    }>;
    hasIDDocument: MaybeArray<{
      '@type': 'IDDocument';
      issuer: GovernmentOrg & { identifier?: 'string' };
      documentType?: string;
      issueDate?: TDate;
      issueType?: string;
      expirationDate?: TDate;
      classificationMethod?: 'automatic' | 'manual';
      idClass: TDocumentClass;
      idClassName?: string;
      countryCode?: string;
      frontImage?: string;
      backImage?: string;
      generic?: boolean;
      keesingCode?: string;
    }>;
  }>;
}
export type VCIDDocPerson = AtomicVCV1<VCSIDDocPerson>;

//////////////////////////////////////////////////////////////
// Employment/delegation
//////////////////////////////////////////////////////////////
export interface VCSEmploymentPerson extends Subject<Person> {
  '@type': 'Person';
  employeeOf: MaybeArray<{
    '@type': 'EmployeeRole';
    employeeOf: {
      name?: string;
      address?: MaybeArray<PostalAddress>;
      legalName?: string;
      dissolutionDate?: string;
      hasCredential?: MaybeArray<{
        '@type': 'IncorporationCredential';
        credentialCategory?: string;
        additionalType?: string;
        dateCreated?: string;
        datePublished?: string;
        recognizedBy?: MaybeArray<GovernmentOrg>;
      }>;
      telephone?: string;
      faxNumber?: string;
      email?: string;
      website?: MaybeArray<WebSite>;
    };
  }>;
}
export interface VCSEmploymentOrganization extends Subject<Organization> {
  '@type': 'Organization';
  name?: string;
  legalName?: string;
  address?: MaybeArray<PostalAddress>;
  dissolutionDate?: string;
  hasCredential?: MaybeArray<{
    '@type': 'IncorporationCredential';
    credentialCategory?: string;
    additionalType?: string;
    dateCreated?: string;
    datePublished?: string;
    recognizedBy?: MaybeArray<GovernmentOrg>;
  }>;
  telephone?: string;
  faxNumber?: string;
  email?: string;
  website?: MaybeArray<WebSite>;
  employee: MaybeArray<{ '@type': 'EmployeeRole'; employee: Person }>;
}
export type VCEmploymentPerson = AtomicVCV1<VCSEmploymentPerson>;
export type VCEmploymentOrganization = AtomicVCV1<VCSEmploymentOrganization>;

//////////////////////////////////////////////////////////////
// SSN/National ID number
//////////////////////////////////////////////////////////////
export interface VCSNatIDNumPerson extends Subject<Person> {
  '@type': 'Person';
  location: {
    '@type': 'Role';
    location: GovernmentOrg;
    identifier: {
      '@type': 'PropertyValue';
      propertyID: string;
      value: string | number;
    };
  };
}
export interface VCSNatIDNumOrganization extends Subject<Organization> {
  '@type': 'Organization';
  nationality: {
    '@type': 'Role';
    nationality: GovernmentOrg;
    identifier: {
      '@type': 'PropertyValue';
      propertyID: string;
      value: string | number;
    };
  };
}
export type VCNatIDNumPerson = AtomicVCV1<VCSNatIDNumPerson>;
export type VCNatIDNumOrganization = AtomicVCV1<VCSNatIDNumOrganization>;

//////////////////////////////////////////////////////////////
// Address
//////////////////////////////////////////////////////////////
export interface VCSAddressPerson extends Subject<Person> {
  '@type': 'Person';
  address: MaybeArray<PostalAddress>;
}
export interface VCSAddressOrganization extends Subject<Organization> {
  '@type': 'Organization';
  address: MaybeArray<PostalAddress>;
}
export type VCAddressPerson = AtomicVCV1<VCSAddressPerson>;
export type VCAddressOrganization = AtomicVCV1<VCSAddressOrganization>;

//////////////////////////////////////////////////////////////
// Birthdate/DOB
//////////////////////////////////////////////////////////////
export interface VCSDOBPerson extends Subject<Person> {
  '@type': 'Person';
  birthDate: string;
}
export type VCDOBPerson = AtomicVCV1<VCSDOBPerson>;

//////////////////////////////////////////////////////////////
// Gender
//////////////////////////////////////////////////////////////
export interface VCSGenderPerson extends Subject<Person> {
  '@type': 'Person';
  gender: MaybeArray<GenderType | string>;
}
export type VCGenderPerson = AtomicVCV1<VCSDOBPerson>;

//////////////////////////////////////////////////////////////
// Accounts and assets
//////////////////////////////////////////////////////////////
export interface AccountRole {
  '@type': 'AccountRole';
  member: {
    '@type': 'Organization';
    name: string;
    identifier: string | number;
  };
  identifier: string | number;
  startDate?: string;
  endDate?: string;
  accountType?: string;
  accountTypeConfidence?: number;
}
export interface MonetaryAmountR extends MonetaryAmount {
  currency: string;
  value: number | string;
  bankAccountCategory?: string;
}
export interface BankAccountRole extends AccountRole {
  value: MonetaryAmountR;
}
export interface VCSAccountPerson extends Subject<Person> {
  '@type': 'Person';
  member: MaybeArray<AccountRole>;
}

export interface VCSAccountAssetsPerson extends Subject<Person> {
  '@type': 'Person';
  member: MaybeArray<BankAccountRole>;
}

/**
 * +--------- Table of implemented attestation types -----------+
 *
 * Key:
 * +------------------------------------------------------------+
 * | X | Attestations completed in this document                |
 * | M | Missing                                                |
 * | D | Deprecated attestations                                |
 * | - | Attestations without a known production implementation |
 * +------------------------------------------------------------+
 *
 * +------------------------------------------------------------------------------------------------+
 * | X | 0  | phone                | VCPhonePerson, VCPhoneOrganization                             |
 * | X | 1  | email                | VCEmailPerson, VCEmailOrganization                             |
 * | D | 2  | facebook             | VCAccountPerson                                                |
 * | X | 3  | sanction-screen      | VCAMLPerson, VCAMLOrganization                                 |
 * | X | 4  | pep-screen           | VCAMLPerson, VCAMLOrganization                                 |
 * | X | 5  | id-document          | VCIDDocPerson                                                  |
 * | D | 6  | google               | VCAccountPerson                                                |
 * | D | 7  | linkedin             | VCAccountPerson                                                |
 * | D | 8  | twitter              | VCAccountPerson                                                |
 * | - | 9  | payroll              |                                                                |
 * | X | 10 | ssn                  | VCNatIDNumPerson, VCNatIDNumOrganization                       |
 * | - | 11 | criminal             |                                                                |
 * | - | 12 | offense              |                                                                |
 * | - | 13 | driving              |                                                                |
 * | X | 14 | employment           | VCEmploymentPerson, VCEmploymentOrganization                   |
 * | - | 15 | education            |                                                                |
 * | - | 16 | drug                 |                                                                |
 * | - | 17 | bank                 |                                                                |
 * | M | 18 | utility              |                                                                |
 * | M | 19 | income               |                                                                |
 * | M | 20 | assets               |                                                                |
 * | X | 21 | 'full-name'          | VCNamePerson, VCNameOrganization                               |
 * | X | 22 | 'birth-date'         | VCDOBPerson                                                    |
 * | X | 23 | gender               | VCGenderPerson                                                 |
 * | - | 24 | group                |                                                                |
 * | - | 25 | meta                 |                                                                |
 * | - | 26 | office               |                                                                |
 * | - | 27 | credential           |                                                                |
 * | - | 28 | medical              |                                                                |
 * | - | 29 | biometric            |                                                                |
 * | - | 30 | supplemental         |                                                                |
 * | - | 31 | vouch                |                                                                |
 * | - | 32 | audit                |                                                                |
 * | X | 33 | address              | VCAddressPerson, VCAddressOrganization                         |
 * | - | 34 | correction           |                                                                |
 * | X | 35 | account              | VCAccountPerson                                                |
 * +------------------------------------------------------------------------------------------------+
 */
