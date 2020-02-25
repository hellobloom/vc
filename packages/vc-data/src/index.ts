import {
  Person,
  Organization,
  Date as TDate,
  GenderType,
  Country,
  State,
  City,
  AdministrativeArea,
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

//////////////////////////////////////////////////////////////
// Account
//////////////////////////////////////////////////////////////
export interface VCSAccountPerson extends Subject<Person> {
  '@type': 'Person';
  memberOf: {
    '@type': 'Role';
    memberOf: Organization;
  };
}
export interface VCSAccountOrganization extends Subject<Organization> {
  '@type': 'Organization';
  memberOf: {
    '@type': 'Role';
    memberOf: Organization;
  };
}

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

export interface VCSAccountPerson extends Subject<Person> {
  '@type': 'Person';
  age?: number;
  birthDate?: TDate;
  familyName?: string;
  givenName?: string;
  gender?: GenderType | string;
  name?: string;
  nationality?: Country;
  hasIDDocument: {
    '@type': 'IDDocumentRole';
    authenticationResult?: string;
    selfieImage?: string;
    faceMatch: {
      '@type': 'IDDocumentFaceMatch';
      isMatch?: boolean;
      score?: number;
      identifier?: number;
    };
    hasIDDocument: {
      '@type': 'IDDocument';
      issuer:
        | Country
        | State
        | City
        | (AdministrativeArea & {
            identifier?: 'string'; // Issuer code
          });
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
    };
  };
}

//////////////////////////////////////////////////////////////
// Organization
//////////////////////////////////////////////////////////////
export interface VCSEmploymentOrganization extends Subject<Organization> {
  id: string;
  data: {
    '@type': 'Corporation';
    name: string;
    legalName: string;

    additionalType: ['PublicCompany'];
    address: [
      {
        '@type': 'PostalAddress';
        streetAddress: string;
        addressCountry: string;
        addressLocality: string;
        addressRegion: string;
        postOfficeBoxNumber: string;
        postalCode: string;
      }
    ];
    dissolutionDate: string;
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential';
        credentialCategory: string;
        additionalType: string;
        recognizedBy: {
          '@type': 'GovernmentOrganization';
          name: string;
        };
      },
      {
        '@type': 'EducationalOccupationalCredential';
        credentialCategory: string;
        additionalType: string;
        dateCreated: string;
        datePublished: string;
        recognizedBy: {
          '@type': 'GovernmentOrganization';
          name: string;
        };
      }
    ];
    telephone: string;
    faxNumber: string;
    email: string;
    subjectOf: [
      {
        '@type': 'WebSite';
        url: string;
      }
    ];
    employee: [
      {
        '@type': 'Person';
        name: string;
        identifier: string;
        jobTitle: Array<string>;
        hasCredential: [
          {
            '@type': 'EducationalOccupationalCredential';
            credentialCategory: string;
            identifier: string;
            recognizedBy: [
              {
                '@type': 'GovernmentOrganization';
                name: string;
              }
            ];
          }
        ];
      }
    ];
  };
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
 * +--------------------------------------------------------------------------------------------+
 * | X | 0  | phone			    |																|
 * | X | 1  | email			    |																|
 * | D | 2  | facebook		    |																|
 * | X | 3  | sanction-screen   |																|
 * | M | 4  | pep-screen        | 																|
 * | M | 5  | id-document       |																|
 * | D | 6  | google            |																|
 * | D | 7  | linkedin			|																|
 * | D | 8  | twitter			|																|
 * | - | 9  | payroll			|																|
 * | M | 10 | ssn			    |																|
 * | - | 11 | criminal			|																|
 * | - | 12 | offense			|																|
 * | - | 13 | driving			|																|
 * | X | 14 | employment		|																|
 * | - | 15 | education			|																|
 * | - | 16 | drug			    |																|
 * | - | 17 | bank			    |																|
 * | M | 18 | utility			|																|
 * | M | 19 | income			|																|
 * | M | 20 | assets			|																|
 * | M | 21 | 'full-name'       |																|
 * | M | 22 | 'birth-date'      |																|
 * | M | 23 | gender			|																|
 * | - | 24 | group			    |																|
 * | - | 25 | meta			    |																|
 * | - | 26 | office			|																|
 * | - | 27 | credential	    |																|
 * | - | 28 | medical			|																|
 * | - | 29 | biometric			|																|
 * | - | 30 | supplemental	    |																|
 * | - | 31 | vouch			    |																|
 * | - | 32 | audit			    |																|
 * | M | 33 | address			|																|
 * | - | 34 | correction		|																|
 * | X | 35 | account			|																|
 * +--------------------------------------------------------------------------------------------+
 */
