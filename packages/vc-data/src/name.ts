import {AtomicVCV1} from '@bloomprotocol/vc-common'
import {Subject} from './base'
import {Person, Organization} from 'schema-dts'

export type VCSNamePerson = Subject<Person> & {
  '@type': 'Person'
  name: string
}
export type VCSNameOrganization = Subject<Organization> & {
  '@type': 'Organization'
  name: string
}
export type VCNamePerson = AtomicVCV1<VCSNamePerson>
export type VCNameOrganization = AtomicVCV1<VCSNameOrganization>
