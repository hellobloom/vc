import {SimpleThing} from '../shared/v1'
import {AtomicVCV1, AtomicVCSubjectV1} from '../atomic/v1'
import * as R from 'ramda'
const uuid = require('uuidv4')

// Generic
export type ObjectGeneric = {[k: string]: any}

// Primitives
export type NE = 'nodes' | 'edges'
export type INode = {
  '@type'?: string
  '@nodeId': string
}
export type INodeR = Required<INode>
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

// CredentialSubjects
export type SDVCCSStructuralPartialNode = {
  '@type': 'VCStructure'
  nodes: [INode]
}
export type SDVCCSStructuralPartialEdge = {
  '@type': 'VCStructure'
  edges: [IEdge]
}
export type SDVCCSFull<T extends SimpleThing> = {
  id: string
  sdvcClass: 'Full'
  data: T
}
export type SDVCCSStructuralFull = {
  id: string
  sdvcClass: 'StructuralFull'
  data: {
    '@type': 'VCStructure'
    nodes: Array<INode>
    edges: Array<IEdge>
  }
}
export type SDVCCSStructuralPartial = {
  id: string
  sdvcClass: 'StructuralPartial'
  data: SDVCCSStructuralPartialNode | SDVCCSStructuralPartialEdge
}
export type SDVCCSNodePropertyList = {
  id: string
  sdvcClass: 'NodePropertyList'
  data: {
    '@type': 'NodePropertyList'
  } & INodePropertyList
}
export type SDVCCSPartial = {
  id: string
  sdvcClass: 'StructuralPartial'
  data: IPartial
}

// VCs
export type SDVCFull<T extends SimpleThing> = AtomicVCV1<SDVCCSFull<T>>
export type SDVCStructuralFull = AtomicVCV1<SDVCCSStructuralFull>
export type SDVCStructuralPartial = AtomicVCV1<SDVCCSStructuralPartial>
export type SDVCNodePropertyList = AtomicVCV1<SDVCCSNodePropertyList>
export type SDVCPartial = AtomicVCV1<SDVCCSPartial>

////////////////////////////////////////////////
// Explode utilities
////////////////////////////////////////////////

export type Compact<T> = T extends object ? {[K in keyof T]: T[K]} : T

/*
// prettier-ignore
export type RecursiveNodeId<T extends object> = Compact<
  {
    [P in keyof T]: T[P] extends object
    ? RecursiveNodeId<T[P]>
    : T[P] extends Array<object>
    ? Array<RecursiveNodeId<T[P][0]>>
    : T[P];
  } & { '@nodeId': string }
>;

// prettier-ignore
export type RecursiveNodeId<T extends any> = T extends Array<any>
  ? RecursiveNodeIdI<T[0]>
  : T extends {[k: string]: any}
  ? {'@nodeId': string} & {[P in keyof T]: RecursiveNodeIdI<T[P]>}
  : T
  */

export type RecursiveNodeId<T> = T // Placeholder

const assignNodeIds = (x: any): RecursiveNodeId<any> => {
  if (Array.isArray(x)) {
    return x.map(assignNodeIds)
  } else if (typeof x === 'object') {
    return {...assignNodeIds(x), '@nodeId': uuid()}
  } else {
    return x
  }
}

export const explodeToSDVC = async <T extends SimpleThing = SimpleThing>(
  credSubj: AtomicVCSubjectV1<T>,
  opts: {
    StructuralFull: true
    StructuralPartial: true
    NodePropertyList: true
    Partial: true
  },
): Promise<Array<SDVCCSFull<T> | SDVCCSStructuralFull | SDVCCSStructuralPartial | SDVCCSNodePropertyList | SDVCCSPartial>> => {
  var structuralFull: undefined | SDVCCSStructuralFull
  var structuralFulls: undefined | Array<SDVCCSStructuralFull>

  const full: SDVCCSFull<RecursiveNodeId<T>> = (await atomicVCSubjectV1ToFull(credSubj)) as any
  const fulls: Array<SDVCCSFull<RecursiveNodeId<T>>> = [full]

  const structuralMaster = await explodeStructure(full, {includeNodeTypes: true})

  if (opts.StructuralFull || opts.StructuralPartial) {
    structuralFull = await getStructure(structuralMaster)
    structuralFulls = [structuralFull]
  } else {
    structuralFulls = []
  }

  const structuralPartials: Array<SDVCCSStructuralPartial> = opts.StructuralPartial
    ? await structuralMasterToStructuralPartials(structuralMaster)
    : []

  const nodePropertyLists: Array<SDVCCSNodePropertyList> = opts.NodePropertyList
    ? await structuralMasterToNodePropertyLists(structuralMaster)
    : []

  const partials: Array<SDVCCSPartial> = opts.Partial ? await structuralMasterToPartials(structuralMaster) : []

  return [
    ...fulls,
    ...structuralFulls!,
    ...structuralPartials,
    ...nodePropertyLists,
    ...partials,

    // if both NodePropertyList and Partial are specified, there's some room for optimization at scale here, one function can produce both from one tree traversal
  ]
}

export const atomicVCSubjectV1ToFull = async <T extends SimpleThing>(
  credSubj: AtomicVCSubjectV1<T>,
): Promise<SDVCCSFull<RecursiveNodeId<T>>> => {
  const credSubjClone = R.clone(credSubj) // Don't mutate credSubj
  const newCredSubjData: RecursiveNodeId<T> = assignNodeIds(credSubjClone['data'])
  return {
    ...credSubjClone,
    data: newCredSubjData,
    sdvcClass: 'Full',
  }
}

export const explodeStructure = async (full: SDVCCSFull<any>, opts: AccumulateStructureOpts): Promise<StructuralMaster> => {
  const accumulator: StructuralMaster = {
    nodes: [],
    edges: [],
    nodePropertyLists: [],
    partials: [],
  }
  accumulateStructure(accumulator, full, opts)
  return accumulator
}

export interface AccumulateStructureOpts {
  includeNodeTypes: boolean
}

export const addNodeToAccumulator = (
  accumulator: StructuralMaster,
  sourceNode: ObjectGeneric,
  item: ObjectGeneric,
  property: string,
  opts: AccumulateStructureOpts,
) => {
  accumulator.edges.push({'@nodeId': sourceNode['@nodeId'], '@property': property, '@targetNodeId': item['@nodeId']})
  accumulateStructure(accumulator, item, opts)
}
export const addPartialToAccumulator = (
  accumulator: StructuralMaster,
  node: ObjectGeneric,
  key: string,
  value: string | number | boolean,
) => {
  accumulator.partials.push({
    '@type': node['@type'],
    '@nodeId': node['@nodeId'],
    [key]: value,
  })
}
export const accumulateStructure = (accumulator: StructuralMaster, node: ObjectGeneric, opts: AccumulateStructureOpts) => {
  const nodeProperties: Array<string> = []
  Object.keys(node).forEach(key => {
    nodeProperties.push(key)
    const value = node[key]
    if (Array.isArray(value)) {
      value.forEach(item => {
        if (Array.isArray(value)) {
          // no-op - invalid
        } else if (typeof item === 'object') {
          addNodeToAccumulator(accumulator, node, item, key, opts)
        } else {
          addPartialToAccumulator(accumulator, node, key, item)
        }
      })
    } else if (typeof value === 'object') {
      addNodeToAccumulator(accumulator, node, value, key, opts)
    } else {
      addPartialToAccumulator(accumulator, node, key, value)
    }
  })
  accumulator.nodes.push({
    '@nodeId': node['@nodeId'],
    ...(opts.includeNodeTypes && {'@type': node['@type']}),
  })
  accumulator.nodePropertyLists.push({
    '@nodeId': node['@nodeId'],
    '@properties': nodeProperties,
  })
}

export const getStructure = async (structuralMaster: StructuralMaster): Promise<SDVCCSStructuralFull> => {
  return {
    id: uuid(),
    sdvcClass: 'StructuralFull',
    data: {
      '@type': 'VCStructure',
      nodes: structuralMaster.nodes,
      edges: structuralMaster.edges,
    },
  }
}

export const structuralMasterToStructuralPartials = async (structuralMaster: StructuralMaster): Promise<Array<SDVCCSStructuralPartial>> => {
  const props: Array<NE> = ['nodes', 'edges']
  const structuralPartials: Array<SDVCCSStructuralPartial> = []
  props.forEach((k: NE) => {
    structuralMaster[k].forEach((i: INode | IEdge) => {
      const structuralPartial: SDVCCSStructuralPartial = {
        id: uuid(),
        sdvcClass: 'StructuralPartial',
        data:
          k === 'nodes'
            ? {
                '@type': 'VCStructure',
                nodes: [i] as [INode],
              }
            : {
                '@type': 'VCStructure',
                edges: [i] as [IEdge],
              },
      }
      structuralPartials.push(structuralPartial)
    })
  })
  return structuralPartials
}

export const structuralMasterToNodePropertyLists = async (structuralMaster: StructuralMaster): Promise<Array<SDVCCSNodePropertyList>> => {
  return structuralMaster.nodePropertyLists.map(npl => {
    return {
      id: uuid(),
      sdvcClass: 'NodePropertyList',
      data: {'@type': 'NodePropertyList', ...npl},
    }
  })
}

export const structuralMasterToPartials = async (structuralMaster: StructuralMaster): Promise<Array<SDVCCSPartial>> => {
  return structuralMaster.partials.map(sp => {
    return {
      id: uuid(),
      sdvcClass: 'StructuralPartial',
      data: sp,
    }
  })
}
