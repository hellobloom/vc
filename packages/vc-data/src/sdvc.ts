import {SimpleThing, AtomicVCV1} from '@bloomprotocol/vc-common'
// import {Subject, MaybeArray, MonetaryAmountR, EmployeeRoleOrganization} from './base'
// import {Person, Organization} from 'schema-dts'

export type SDVCNode = {
  '@type'?: string
  '@nodeId': string
}
export type SDVCStructuralPartialNode = {
  '@type': 'VCStructure'
  data: {nodes: [SDVCNode]}
}
export type SDVCEdge = {
  property: string
  source: string
  target: string
}
export type SDVCStructuralPartialEdge = {
  '@type': 'VCStructure'
  data: {edges: [SDVCEdge]}
}
export type SDVCFull<T extends SimpleThing> = {
  id: string
  sdvcClass: 'Full'
  data: T
}
export type SDVCStructuralFull = {
  id: string
  sdvcClass: 'StructuralFull'
  data: {
    '@type': 'VCStructure'
    nodes: Array<SDVCNode>
    edges: Array<SDVCEdge>
  }
}
export type SDVCStructuralPartial = {
  id: string
  sdvcClass: 'StructuralPartial'
  data: SDVCStructuralPartialNode | SDVCStructuralPartialEdge
}
export type SDVCPartial = {
  id: string
  sdvcClass: 'StructuralPartial'
  data: {
    '@type': string
    '@nodeId': string
    [k: string]: string | number | boolean // Only scalar properties
  }
}

export type VCFull<T extends SimpleThing> = AtomicVCV1<SDVCFull<T>>
export type VCStructuralFull = AtomicVCV1<SDVCStructuralFull>
export type VCStructuralPartial = AtomicVCV1<SDVCStructuralPartial>
export type VCPartial = AtomicVCV1<SDVCPartial>
