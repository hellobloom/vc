import {SimpleThing} from '../base/v1'
import {VCV1, VCV1Subject, VCV1Type} from '../v1'

// Generic

export type ObjectGeneric = {[k: string]: any}

// Primitives

export type SelectiveStructureComponent = 'nodes' | 'edges'

export type SelectiveNode = {
  '@type'?: string
  '@nodeId': string
}

export type SelectiveNodeRV = Required<SelectiveNode>

export type SelectiveEdge = {
  '@nodeId': string
  '@property': string
  '@targetNodeId': string
}

export type SelectiveNodePropertyList = {
  '@nodeId': string
  '@properties': Array<string>
}

export type SelectivePartial = {
  '@type': string
  '@nodeId': string
  [k: string]: string | number | boolean // Only scalar properties
}

export type SelectiveStructuralMaster = {
  nodes: Array<SelectiveNode>
  edges: Array<SelectiveEdge>
  nodePropertyLists: Array<SelectiveNodePropertyList>
  partials: Array<SelectivePartial>
}

// Credential Subjects And Types

export type VCV1SelectiveStructuralPartialSubjectNode = {
  '@type': 'VCStructure'
  nodes: [SelectiveNode]
}

export type VCV1SelectiveStructuralPartialSubjectEdge = {
  '@type': 'VCStructure'
  edges: [SelectiveEdge]
}

export type VCV1SelectiveStructuralPartialType = [VCV1Type[0], 'StructuralPartialSDVC', ...string[]]

export type VCV1SelectiveStructuralPartialSubject = VCV1Subject<
  VCV1SelectiveStructuralPartialSubjectNode | VCV1SelectiveStructuralPartialSubjectEdge
>

export type VCV1SelectiveFullType = [VCV1Type[0], 'FullSDVC', ...string[]]

export type VCV1SelectiveFullSubject<T extends SimpleThing> = VCV1Subject<T>

export type VCV1SelectiveStructuralFullType = [VCV1Type[0], 'StructuralFullSDVC', ...string[]]

export type VCV1SelectiveStructuralFullSubject = VCV1Subject<{
  '@type': 'VCStructure'
  nodes: Array<SelectiveNode>
  edges: Array<SelectiveEdge>
}>

export type VCV1SelectiveNodePropertyListType = [VCV1Type[0], 'NodePropertyListSDVC', ...string[]]

export type VCV1SelectiveNodePropertyListSubject = VCV1Subject<
  {
    '@type': 'NodePropertyList'
  } & SelectiveNodePropertyList
>

export type VCV1SelectivePartialType = [VCV1Type[0], 'PartialSDVC', ...string[]]

export type VCV1SelectivePartialSubject = VCV1Subject<SelectivePartial>

// VCs

export type VCV1SelectiveFull<T extends SimpleThing> = VCV1<VCV1SelectiveFullSubject<T>, VCV1SelectiveFullType>
export type VCV1SelectiveStructuralFull = VCV1<VCV1SelectiveStructuralFullSubject, VCV1SelectiveStructuralFullType>
export type VCV1SelectiveStructuralPartial = VCV1<VCV1SelectiveStructuralPartialSubject, VCV1SelectiveStructuralPartialType>
export type VCV1SelectiveNodePropertyList = VCV1<VCV1SelectiveNodePropertyListSubject, VCV1SelectiveNodePropertyListType>
export type VCV1SelectivePartial = VCV1<VCV1SelectivePartialSubject, VCV1SelectivePartialType>
