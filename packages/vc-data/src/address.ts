import {AtomicVCV1} from '@bloomprotocol/vc-common'
import {Subject, MaybeArray} from './base'
import {Person, Organization, PostalAddress} from 'schema-dts'

export type VCSAddressPerson = Subject<Person> & {
  '@type': 'Person'
  address: MaybeArray<PostalAddress>
}
export type VCSAddressOrganization = Subject<Organization> & {
  '@type': 'Organization'
  address: MaybeArray<PostalAddress>
}
export type VCAddressPerson = AtomicVCV1<VCSAddressPerson>
export type VCAddressOrganization = AtomicVCV1<VCSAddressOrganization>
