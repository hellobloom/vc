import { AtomicVCV1 } from '@bloomprotocol/vc-common';
import { Subject } from './base';
import { Person, Organization } from 'schema-dts';

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
