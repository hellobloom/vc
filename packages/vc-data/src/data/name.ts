import {VCV1} from '@bloomprotocol/vc-common'
import {MaybeArray, Subject} from './base'
import {Person, Organization} from 'schema-dts'

export type VCSNamePerson = Subject<Person> & {
  '@type': 'Person'
  name: MaybeArray<string>
}
export type VCSNameOrganization = Subject<Organization> & {
  '@type': 'Organization'
  name: MaybeArray<string>
}
export type VCNamePerson = VCV1<VCSNamePerson>
export type VCNameOrganization = VCV1<VCSNameOrganization>
