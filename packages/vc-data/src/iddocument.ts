import { AtomicVCV1 } from '@bloomprotocol/vc-common';
import { Subject, MaybeArray, GovernmentOrg } from './base';
import { Person, Country, GenderType, Date as TDate } from 'schema-dts';

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
