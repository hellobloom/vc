import { AtomicVCV1 } from '@bloomprotocol/vc-common';
import {
  Subject,
  MaybeArray,
  EmployeeRoleOrganization,
  OrganizationE,
} from './base';
import { Person } from 'schema-dts';

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
