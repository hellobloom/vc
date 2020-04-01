import {VCV1} from '@bloomprotocol/vc-common'
import {MaybeArray, Subject, GovernmentOrg} from './base'
import {Person, Organization} from 'schema-dts'

export type BaseAttList = {
  name?: string
  url?: string
}
export type BaseAttHit = {
  id?: string
  name?: string
}
export type AMLSearch = {
  '@type': 'AMLSearch'
  hitLocation?: string | GovernmentOrg
  hitNumber?: number
  lists?: Array<BaseAttList>
  recordId?: MaybeArray<string>
  identifier?: string
  score?: string | number
  hits?: Array<BaseAttHit>
  flagType?: string
  comment?: string
}
export type VCSAMLPerson = Subject<
  Person & {
    '@type': 'Person'
    hasAMLSearch: AMLSearch
  }
>
export type VCSAMLOrganization = Subject<
  Organization & {
    '@type': 'Organization'
    hasAMLSearch: AMLSearch
  }
>
export type VCAMLPerson = VCV1<VCSAMLPerson>
export type VCAMLOrganization = VCV1<VCSAMLOrganization>
