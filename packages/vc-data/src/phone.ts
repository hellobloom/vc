import {VCV1} from '@bloomprotocol/vc-common'
import {Subject, MaybeArray} from './base'
import {Person, Organization} from 'schema-dts'

export type VCSPhonePerson = Subject<Person> & {
  '@type': 'Person'
  telephone: MaybeArray<string>
}
export type VCSPhoneOrganization = Subject<Organization> & {
  '@type': 'Organization'
  telephone: MaybeArray<string>
}
export type VCPhonePerson = VCV1<VCSPhonePerson>
export type VCPhoneOrganization = VCV1<VCSPhoneOrganization>
