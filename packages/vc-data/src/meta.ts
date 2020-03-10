import {AtomicVCV1} from '@bloomprotocol/vc-common'
import {Subject, MaybeArray} from './base'
import {Person, Organization} from 'schema-dts'

//////////////////////////////////////////////////////////////
// Meta/aggregation
//////////////////////////////////////////////////////////////
export type ReceivedCredentialRole = {
  '@type': 'ReceivedCredentialRole'
  startDate?: string
  endDate?: string
  aggregator?: string
  contextsSome?: Array<string>
  contextsAll?: Array<string>
  contextsNot?: Array<string>
  reporterDidSome?: Array<string>
  reporterDidAll?: Array<string>
  reporterDidNot?: Array<string>
  receivedCredentials: MaybeArray<string | AtomicVCV1>
}
export type VCSMetaPerson = Subject<Person> & {
  '@type': 'Person'
  receivedCredentials: MaybeArray<ReceivedCredentialRole>
}
export type VCSMetaOrganization = Subject<Organization> & {
  '@type': 'Organization'
  receivedCredentials: MaybeArray<ReceivedCredentialRole>
}
export type VCMetaPerson = AtomicVCV1<VCSMetaPerson>
export type VCMetaOrganization = AtomicVCV1<VCSMetaOrganization>
