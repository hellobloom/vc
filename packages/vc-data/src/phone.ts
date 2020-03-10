import { AtomicVCV1 } from '@bloomprotocol/vc-common';
import { Subject } from './base';
import { Person, Organization } from 'schema-dts';

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
