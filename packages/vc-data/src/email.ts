import {AtomicVCV1} from '@bloomprotocol/vc-common'
import {Subject} from './base'
import {Person, Organization} from 'schema-dts'

export type VCSEmailPerson = Subject<Person> & {
  '@type': 'Person'
  email: string
}
export type VCSEmailOrganization = Subject<Organization> & {
  '@type': 'Person'
  email: string
}
export type VCEmailPerson = AtomicVCV1<VCSEmailPerson>
export type VCEmailOrganization = AtomicVCV1<VCSEmailOrganization>
