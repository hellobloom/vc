import {AtomicVCV1} from '../../vc/atomic/v1'
//import {Organization, PostalAddress, Text, Event, Person} from 'schema-dts'
import {Organization} from 'schema-dts'

/*
// Base types
// export type TLangString = {value: string; lang: string}
export type TLangString = {[locale: string]: string}
export type TMaybeArray<T> = T | Array<T>

// credentialSubject types

// Entity type - for the existence of a legal entity
export type VCEntityCS = {
  identifier: string
  entity: VCEntityCSEntity
  //registrationchanges for CN and registered activities for Singapore
  registrationEvents: Array<Event>
  representative: TMaybeArray<Person>
  bankruptcy: Array<{
    caseId: string
    caseType: string
    date: string
    status: string
  }>
  legalRecords: {}
}

export type TAddress = Text | PostalAddress

export type VCEntityCSEntity = Organization & {
  name: TMaybeArray<Text>
  legalName: TMaybeArray<Text>
  address: TMaybeArray<TAddress>
  description: Text
  identifier: string
  type: string
  state: string
  //example of how to address multiple languages like pinyin and chinese
  registrationDate: string
  expirationDate: string
  registrationAuthority: string // ACRA in Singapore
  telephone: string
  faxNumber: string
  email: string
  url: string
  aliases: {
    type: string
  }
}

export type VCEntity = AtomicVCV1<VCEntityCS, ['VerifiableCredential', 'AtomicCredential', 'EntityCredential']>
  */

// Coerce Organization to object
export type OrganizationObj = Organization & {identifier: string}

export type VCEntity = AtomicVCV1<OrganizationObj, ['VerifiableCredential', 'AtomicCredential', 'EntityCredential']>

export const VCEntityExampleOrganization: OrganizationObj = {
  '@type': 'Corporation',
  name: 'ACME Inc.',
  legalName: 'Acme Holding Group Inc. LLC',
  identifier: '911500007014628574',
  additionalType: ['PublicCompany'],
  address: [
    {
      '@type': 'PostalAddress',
      streetAddress: '123 Road',
      addressCountry: 'Singapore',
      addressLocality: 'Kallang',
      addressRegion: 'Singapore',
      postOfficeBoxNumber: '92151ABCbF2',
      postalCode: '125912-212',
    },
  ],
  dissolutionDate: '2020-02-03T21:03:53.192Z',
  hasCredential: [
    {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'Corporation',
      additionalType: 'Incorporation',
      recognizedBy: {
        '@type': 'GovernmentOrganization',
        name: '鄂尔多斯市工商行政管理局', // ACRA in Singapore
      },
    },
    {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'Bankruptcy',
      additionalType: 'Bankruptcy',
      recognizedBy: {
        '@type': 'GovernmentOrganization',
        name: '鄂尔多斯市工商行政管理局', // ACRA in Singapore
      },
    },
  ],
  telephone: '+86-010-57376964',
  faxNumber: '+86-010-56632450',
  email: 'elion600277_zqb@elion.com.cn',
  subjectOf: [
    {
      '@type': 'WebSite',
      url: 'http://www.elion.cn/',
    },
  ],
  employee: [
    {
      '@type': 'Person',
      name: 'Dora El-Explorer',
      identifier: 'c22814e7-bad2-41b9-8ee0-7bd9fd59b734',
      jobTitle: ['Authorized Representative', 'Officer', 'Owner', 'Nominee Director', 'Company Secretary'],
      hasCredential: [
        {
          '@type': 'EducationalOccupationalCredential',
          credentialCategory: 'Citizenship',
          identifier: 'S0123456@',
          recognizedBy: [
            {
              '@type': 'GovernmentOrganization',
              name: 'Singapore Office of Citizenship',
            },
          ],
        },
      ],
    },
  ],
}

export const VCEntityExample: VCEntity = {
  // "@context" may resolve to an object that includes "@language": "en" or equivalent
  '@context': ['https://www.w3.org/2018/credentials/v1', 'https://www.w3.org/2018/credentials/examples/v1'],
  type: ['VerifiableCredential', 'AtomicCredential', 'EntityCredential'],
  issuer: 'https://tridentb2b.com',
  issuanceDate: '2020-02-03T21:03:53.192Z',
  revocation: {
    '@context': 'foobar',
    token: 'foobar',
  },
  proof: {
    type: 'EcdsaSecp256k1Signature2019',
    created: '2020-02-03T21:03:53.192Z',
    proofPurpose: 'assertionMethod',
    verificationMethod: 'authentication',
    jws: '0xacfb8aebf80261cab09fabc9eafcbf9bcab19285178f8b32aebc',
  },
  credentialSubject: VCEntityExampleOrganization,
}
