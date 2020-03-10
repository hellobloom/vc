import {AtomicVCV1} from '@bloomprotocol/vc-common'
import {Subject, MaybeArray} from './base'
import {Person, GenderType} from 'schema-dts'

export type VCSGenderPerson = Subject<Person> & {
  '@type': 'Person'
  gender: MaybeArray<GenderType | string>
}
export type VCGenderPerson = AtomicVCV1<VCSGenderPerson>
