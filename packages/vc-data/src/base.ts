import {
  Organization,
  Corporation,
  Country,
  GovernmentOrganization,
  State,
  City,
  AdministrativeArea,
  MonetaryAmount,
  // Person,
  // MonetaryAmount,
  // Date as TDate,
  // GenderType,
  PostalAddress,
  WebSite,
} from 'schema-dts';

import { AtomicVCSubjectV1, SimpleThing } from '@bloomprotocol/vc-common';

export type Modify<T, R> = Pick<T, Exclude<keyof T, keyof R>> & R;
export type Extend<T, R> = Modify<Exclude<T, string>, R>;
export type Subject<T extends SimpleThing | string> = AtomicVCSubjectV1<
  Exclude<T, string>
>;

export type MaybeArray<T> = T | Array<T>;

///////////////////////////////////////////////////////
// schema-dts type extensions
///////////////////////////////////////////////////////

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

export interface MonetaryAmountR extends MonetaryAmount {
  currency: string;
  value: number | string;
}

export interface EmployeeRoleOrganization {
  '@type': 'EmployeeRole';
  employeeOf: OrganizationE;
}

export interface OrganizationE extends Subject<Organization> {
  '@type': 'Organization';
  name?: string;
  address?: MaybeArray<PostalAddress>;
  legalName?: string;
  dissolutionDate?: string;
  hasCredential?: MaybeArray<IncorporationCredential>;
  telephone?: string;
  faxNumber?: string;
  email?: string;
  website?: MaybeArray<WebSite>;
}

export interface IncorporationCredential {
  '@type': 'IncorporationCredential';
  credentialCategory?: string;
  additionalType?: string;
  dateCreated?: string;
  datePublished?: string;
  recognizedBy?: MaybeArray<GovernmentOrg>;
}
