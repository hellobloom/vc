import {VCV1} from '@bloomprotocol/vc-common'
import {Subject, MaybeArray} from './base'
import {Person, Organization, PostalAddress} from 'schema-dts'

export type VCSAddressPerson = Subject<
  Person & {
    '@type': 'Person'
    address: MaybeArray<PostalAddress>
  }
>
export type VCSAddressOrganization = Subject<
  Organization & {
    '@type': 'Organization'
    address: MaybeArray<PostalAddress>
  }
>
export type VCAddressPerson = VCV1<VCSAddressPerson>
export type VCAddressOrganization = VCV1<VCSAddressOrganization>
