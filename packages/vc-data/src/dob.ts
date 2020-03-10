import { AtomicVCV1 } from '@bloomprotocol/vc-common';
import { Subject } from './base';
import { Person } from 'schema-dts';

export interface VCSDOBPerson extends Subject<Person> {
  '@type': 'Person';
  birthDate: string;
}
export type VCDOBPerson = AtomicVCV1<VCSDOBPerson>;
