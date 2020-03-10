import {AtomicVCV1} from '@bloomprotocol/vc-common'
import {Subject} from './base'
import {Person, Organization} from 'schema-dts'

export type BaseAttList = {
  name?: string
  url?: string
}
export type BaseAttHit = {
  id?: string
  hitName?: string
}
export type TAMLSearch = {
  '@type': 'AMLSearch'
  hitLocation?: string
  hitNumber?: number
  lists?: Array<BaseAttList>
  recordId?: string
  searchReferenceId?: string
  score?: string
  hits?: Array<BaseAttHit>
  flagType?: string
  comment?: string
}
export type VCSAMLPerson = Subject<Person> & {
  '@type': 'Person'
  hasAMLSearch: TAMLSearch
}
export type VCSAMLOrganization = Subject<Organization> & {
  '@type': 'Organization'
  hasAMLSearch: TAMLSearch
}
export type VCAMLPerson = AtomicVCV1<VCSAMLPerson>
export type VCAMLOrganization = AtomicVCV1<VCSAMLOrganization>
