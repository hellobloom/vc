import {SimpleThing} from '../base/v1'
import {VCV1, VCV1Subject, VCV1Type} from '../v1'

/////////////////////////////////////////////////
// Generic
/////////////////////////////////////////////////
export type ObjectGeneric = {[k: string]: any}

/////////////////////////////////////////////////
// Primitives
/////////////////////////////////////////////////
export type SelectiveStructureComponent = 'nodes' | 'edges'

export type SelectiveNode = {
  '@type': 'SelectiveNode'
  // Originates that node is the root node of the object graph.  Technically optional but strongly recommended for prescribed schema compliance & object reconstruction
  '@nodeIsRoot'?: boolean
  // Depth of node, technically optional but strongly recommended for prescribed schema compliance & object reconstruction
  '@nodeDepth'?: boolean
  // UUID assigned to node
  '@nodeId': string
}

export type SelectiveNodeR = Required<SelectiveNode>

export type SelectiveEdge = {
  '@type': 'SelectiveEdge'
  // Origin node ID
  '@nodeId': string
  // Property on origin node hosting relationship
  '@property': string
  // Target/child node ID
  '@targetNodeId': string
}

export type SelectiveNodePropertyList = {
  '@type': 'SelectiveNodePropertyList'
  // Original VC ID
  '@vcId': string
  // ID of node
  '@nodeId': string
  // Properties/keys of node
  '@properties': Array<string>
}

export type SelectivePartial = {
  // @type should be set to "SelectivePartial" if the @type of the origin node is to be omitted - otherwise, string values should be assumed to be the origin node @type.
  '@type': string
  // Original VC ID
  '@vcId': string
  // UUID assigned to node
  '@nodeId': string
  // Single property of node for inclusion in partial
  [k: string]: string | number | boolean | undefined | null // Only scalar properties
}

export type SelectiveType = {
  '@type': 'SelectiveType'
  // Original VC ID
  '@vcId': string
  // Top-level "type" array of original VC
  type: VCV1Type
}

/////////////////////////////////////////////////
// Credential subjects and types
/////////////////////////////////////////////////
export type SelectiveNodeWrapper = {nodes: [SelectiveNode]}
export type SelectiveEdgeWrapper = {edges: [SelectiveEdge]}
export type VCV1SelectiveStructuralPartialSubjectData = {
  // Original VC ID
  '@vcId': string
  '@type': 'SelectiveStructure'
} & (SelectiveNodeWrapper | SelectiveEdgeWrapper)

export type VCV1SelectiveStructuralFullSubjectData = {
  // Original VC ID
  '@vcId': string
  '@type': 'SelectiveStructuralFull'
  nodes: Array<SelectiveNode>
  edges: Array<SelectiveEdge>
}

// Full node, identical to primitive BaseVC with added constraint that every object contained within the CredentialSubject has a @nodeId property specified
export type VCV1SelectiveFullType = [VCV1Type[0], 'SelectiveFullCredential', ...string[]]
export type VCV1SelectiveFullSubject<T extends SimpleThing> = VCV1Subject<T>

// SelectiveStructuralFull: Metadata of all nodes and edges
export type VCV1SelectiveStructuralFullType = [VCV1Type[0], 'SelectiveStructuralFullCredential', ...string[]]
export type VCV1SelectiveStructuralFullSubject = VCV1Subject<VCV1SelectiveStructuralFullSubjectData>

// SelectiveStructuralPartial: Metadata of single node or edge
export type VCV1SelectiveStructuralPartialType = [VCV1Type[0], 'SelectiveStructuralPartialCredential', ...string[]]
export type VCV1SelectiveStructuralPartialSubject = VCV1Subject<VCV1SelectiveStructuralPartialSubjectData>

// SelectiveNodePropertyList: Manifest of properties for node
export type VCV1SelectiveNodePropertyListType = [VCV1Type[0], 'SelectiveNodePropertyListCredential', ...string[]]
export type VCV1SelectiveNodePropertyListSubject = VCV1Subject<SelectiveNodePropertyList>

// SelectivePartialSubject: VC for single property of node
export type VCV1SelectivePartialType = [VCV1Type[0], 'SelectivePartialCredential', ...string[]]
export type VCV1SelectivePartialSubject = VCV1Subject<SelectivePartial>

// SelectiveTypeSubject: VC for single property of node
export type VCV1SelectiveTypeType = [VCV1Type[0], 'SelectiveTypeCredential', ...string[]]
export type VCV1SelectiveTypeSubject = VCV1Subject<SelectiveType>

/////////////////////////////////////////////////
// Fully constructed VCs
/////////////////////////////////////////////////
export type VCV1SelectiveFull<T extends SimpleThing> = VCV1<VCV1SelectiveFullSubject<T>, VCV1SelectiveFullType>
export type VCV1SelectiveStructuralFull = VCV1<VCV1SelectiveStructuralFullSubject, VCV1SelectiveStructuralFullType>
export type VCV1SelectiveStructuralPartial = VCV1<VCV1SelectiveStructuralPartialSubject, VCV1SelectiveStructuralPartialType>
export type VCV1SelectiveNodePropertyList = VCV1<VCV1SelectiveNodePropertyListSubject, VCV1SelectiveNodePropertyListType>
export type VCV1SelectivePartial = VCV1<VCV1SelectivePartialSubject, VCV1SelectivePartialType>
export type VCV1SelectiveType = VCV1<VCV1SelectiveTypeSubject, VCV1SelectiveTypeType>
