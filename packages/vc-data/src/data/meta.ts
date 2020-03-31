import {VCV1} from '@bloomprotocol/vc-common'
import {Subject, MaybeArray} from './base'
import {Person, Organization} from 'schema-dts'

//////////////////////////////////////////////////////////////
// Meta/aggregation
//////////////////////////////////////////////////////////////
export type ReceivedCredentialRole = {
  '@type': 'ReceivedCredentialRole'
  startDate?: string
  endDate?: string
  aggregatorDID?: string
  typesSome?: Array<string>
  typesAll?: Array<string>
  typesNot?: Array<string>
  contextsSome?: Array<string>
  contextsAll?: Array<string>
  contextsNot?: Array<string>
  issuerDIDIn?: Array<string>
  issuerDIDNotIn?: Array<string>
  receivedCredentials: MaybeArray<string | VCV1>
}
export type VCSMetaPerson = Subject<Person> & {
  '@type': 'Person'
  receivedCredentials: MaybeArray<ReceivedCredentialRole>
}
export type VCSMetaOrganization = Subject<Organization> & {
  '@type': 'Organization'
  receivedCredentials: MaybeArray<ReceivedCredentialRole>
}
export type VCMetaPerson = VCV1<VCSMetaPerson>
export type VCMetaOrganization = VCV1<VCSMetaOrganization>
