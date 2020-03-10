import { AtomicVCV1 } from '@bloomprotocol/vc-common';
import { Subject } from './base';
import { Person, Organization } from 'schema-dts';

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
