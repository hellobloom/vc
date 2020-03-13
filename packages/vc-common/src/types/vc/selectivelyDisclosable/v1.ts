import {SimpleThing} from '../shared/v1'
import {AtomicVCV1, AtomicVCSubjectV1, AtomicVCTypeV1} from '../atomic/v1'

// Generic

export type ObjectGeneric = {[k: string]: any}

// Primitives

export type NE = 'nodes' | 'edges'

export type INode = {
  '@type'?: string
  '@nodeId': string
}

export type INodeRV = Required<INode>

export type IEdge = {
  '@nodeId': string
  '@property': string
  '@targetNodeId': string
}

export type INodePropertyList = {
  '@nodeId': string
  '@properties': Array<string>
}

export type IPartial = {
  '@type': string
  '@nodeId': string
  [k: string]: string | number | boolean // Only scalar properties
}

export type StructuralMaster = {
  nodes: Array<INode>
  edges: Array<IEdge>
  nodePropertyLists: Array<INodePropertyList>
  partials: Array<IPartial>
}

// Credential Subjects And Types

export type StructuralPartialSDVCSubjectNodeV1 = {
  '@type': 'VCStructure'
  nodes: [INode]
}

export type StructuralPartialSDVCSubjectEdgeV1 = {
  '@type': 'VCStructure'
  edges: [IEdge]
}

export type StructuralPartialSDVCTypeV1 = [AtomicVCTypeV1[0], 'StructuralPartialSDVC', ...string[]]

export type StructuralPartialSDVCSubjectV1 = AtomicVCSubjectV1<StructuralPartialSDVCSubjectNodeV1 | StructuralPartialSDVCSubjectEdgeV1>

export type FullSDVCTypeV1 = [AtomicVCTypeV1[0], 'FullSDVC', ...string[]]

export type FullSDVCSubjectV1<T extends SimpleThing> = AtomicVCSubjectV1<T>

export type StructuralFullSDVCTypeV1 = [AtomicVCTypeV1[0], 'StructuralFullSDVC', ...string[]]

export type StructuralFullSDVCSubjectV1 = AtomicVCSubjectV1<{
  '@type': 'VCStructure'
  nodes: Array<INode>
  edges: Array<IEdge>
}>

export type NodePropertyListSDVCTypeV1 = [AtomicVCTypeV1[0], 'NodePropertyListSDVC', ...string[]]

export type NodePropertyListSDVCSubjectV1 = AtomicVCSubjectV1<
  {
    '@type': 'NodePropertyList'
  } & INodePropertyList
>

export type PartialSDVCTypeV1 = [AtomicVCTypeV1[0], 'PartialSDVC', ...string[]]

export type PartialSDVCSubjectV1 = AtomicVCSubjectV1<IPartial>

// VCs

export type FullSDVCV1<T extends SimpleThing> = AtomicVCV1<FullSDVCSubjectV1<T>, FullSDVCTypeV1>
export type StructuralFullSDVCV1 = AtomicVCV1<StructuralFullSDVCSubjectV1, StructuralFullSDVCTypeV1>
export type StructuralPartialSDVCV1 = AtomicVCV1<StructuralPartialSDVCSubjectV1, StructuralPartialSDVCTypeV1>
export type NodePropertyListSDVCV1 = AtomicVCV1<NodePropertyListSDVCSubjectV1, NodePropertyListSDVCTypeV1>
export type PartialSDVCV1 = AtomicVCV1<PartialSDVCSubjectV1, PartialSDVCTypeV1>
