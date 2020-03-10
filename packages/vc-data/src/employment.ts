import { AtomicVCV1 } from '@bloomprotocol/vc-common';
import {
  Subject,
  MaybeArray,
  GovernmentOrg,
  EmployeeRoleOrganization,
} from './base';
import { Person, Organization, PostalAddress, WebSite } from 'schema-dts';

export interface IncorporationCredential {
  '@type': 'IncorporationCredential';
  credentialCategory?: string;
  additionalType?: string;
  dateCreated?: string;
  datePublished?: string;
  recognizedBy?: MaybeArray<GovernmentOrg>;
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
export interface EmployeeRolePerson {
  '@type': 'EmployeeRole';
  employee: Person;
}
export interface VCSEmploymentPerson extends Subject<Person> {
  '@type': 'Person';
  employeeOf: MaybeArray<EmployeeRoleOrganization>;
}
export type VCSEmploymentOrganization = OrganizationE & {
  employee: MaybeArray<EmployeeRolePerson>;
};
export type VCEmploymentPerson = AtomicVCV1<VCSEmploymentPerson>;
export type VCEmploymentOrganization = AtomicVCV1<VCSEmploymentOrganization>;
