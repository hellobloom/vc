import {VCV1} from '@bloomprotocol/vc-common'
import {Subject, MaybeArray} from './base'
import {Person, Organization} from 'schema-dts'

export type VCSEmailPerson = Subject<
  Person & {
    email: MaybeArray<string>
  }
>
export type VCSEmailOrganization = Subject<
  Organization & {
    email: MaybeArray<string>
  }
>
export type VCEmailPerson = VCV1<VCSEmailPerson>
export type VCEmailOrganization = VCV1<VCSEmailOrganization>
