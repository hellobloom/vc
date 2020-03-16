import * as R from 'ramda'
import {uuid} from 'uuidv4'
import {
  // FullSDVCV1,
  // StructuralFullSDVCV1,
  // StructuralPartialSDVCV1,
  // NodePropertyListSDVCV1,
  // PartialSDVCV1,
  FullSDVCSubjectV1,
  StructuralFullSDVCSubjectV1,
  StructuralPartialSDVCSubjectV1,
  NodePropertyListSDVCSubjectV1,
  PartialSDVCSubjectV1,
  SimpleThing,
  StructuralMaster,
  ObjectGeneric,
  NE,
  INode,
  IEdge,
  AtomicVCSubjectV1,
} from '@bloomprotocol/vc-common'

export const buildFullSDVCSubjectV1 = async <Data extends SimpleThing>({
  credentialSubject,
}: {
  credentialSubject: AtomicVCSubjectV1<Data>
}): Promise<FullSDVCSubjectV1<Data>> => {
  const credSubjClone = R.clone(credentialSubject) // Don't mutate credSubj
  const newCredSubjData: RecursiveNodeId<Data> = assignNodeIds(credSubjClone['data'])

  return {
    ...credSubjClone,
    data: newCredSubjData,
  }
}

export type AccumulateStructureOptions = {
  includeNodeTypes: boolean
}

export const buildStructuralMasterV1 = <Data extends SimpleThing>({
  full,
  ...opts
}: {full: FullSDVCSubjectV1<Data>} & AccumulateStructureOptions): StructuralMaster => {
  const accumulator: StructuralMaster = {
    nodes: [],
    edges: [],
    nodePropertyLists: [],
    partials: [],
  }
  accumulateStructure(accumulator, full, opts)
  return accumulator
}

export const buildStructuralFullSDVCSubjectV1 = ({
  structuralMaster,
}: {
  structuralMaster: StructuralMaster
}): StructuralFullSDVCSubjectV1 => ({
  id: uuid(),
  data: {
    '@type': 'VCStructure',
    nodes: structuralMaster.nodes,
    edges: structuralMaster.edges,
  },
})

export const buildAllStructuralPartialSDVCSubjectV1 = ({
  structuralMaster,
}: {
  structuralMaster: StructuralMaster
}): StructuralPartialSDVCSubjectV1[] => {
  const structuralPartials: StructuralPartialSDVCSubjectV1[] = []

  const props: Array<NE> = ['nodes', 'edges']
  props.forEach((k: NE) => {
    structuralMaster[k].forEach((i: INode | IEdge) => {
      const structuralPartial: StructuralPartialSDVCSubjectV1 = {
        id: uuid(),
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

export const buildAllNodePropertyListSDVCSubjectV1 = ({
  structuralMaster,
}: {
  structuralMaster: StructuralMaster
}): NodePropertyListSDVCSubjectV1[] =>
  structuralMaster.nodePropertyLists.map(npl => ({
    id: uuid(),
    sdvcClass: 'NodePropertyList',
    data: {'@type': 'NodePropertyList', ...npl},
  }))

export const buildAllPartialSDVCSubjectV1 = ({structuralMaster}: {structuralMaster: StructuralMaster}): PartialSDVCSubjectV1[] =>
  structuralMaster.partials.map(p => ({
    id: uuid(),
    data: p,
  }))

export const buildAllSDVCSubjectV1 = async <Data extends SimpleThing>({
  credentialSubject,
  includeStructuralFull,
  includeStructuralPartial,
  includeNodePropertyList,
  includePartial,
}: {
  credentialSubject: AtomicVCSubjectV1<Data>
  includeStructuralFull?: boolean
  includeStructuralPartial?: boolean
  includeNodePropertyList?: boolean
  includePartial?: boolean
}): Promise<(
  | FullSDVCSubjectV1<Data>
  | StructuralFullSDVCSubjectV1
  | StructuralPartialSDVCSubjectV1
  | NodePropertyListSDVCSubjectV1
  | PartialSDVCSubjectV1
)[]> => {
  const full = await buildFullSDVCSubjectV1({credentialSubject})

  if (includeStructuralFull || includeStructuralPartial || includeNodePropertyList || includePartial) {
    const sdvcs: (
      | FullSDVCSubjectV1<Data>
      | StructuralFullSDVCSubjectV1
      | StructuralPartialSDVCSubjectV1
      | NodePropertyListSDVCSubjectV1
      | PartialSDVCSubjectV1
    )[] = [full]

    const structuralMaster = buildStructuralMasterV1({full, includeNodeTypes: true})

    if (includeStructuralFull || includeStructuralPartial) {
      const structuralFull = buildStructuralFullSDVCSubjectV1({structuralMaster})
      sdvcs.push(structuralFull)

      if (includeStructuralPartial) {
        const structuralPartials = buildAllStructuralPartialSDVCSubjectV1({structuralMaster})
        sdvcs.concat(structuralPartials)
      }
    }

    if (includeNodePropertyList) {
      const nodePropertyLists = buildAllNodePropertyListSDVCSubjectV1({structuralMaster})
      sdvcs.concat(nodePropertyLists)
    }

    if (includePartial) {
      const partials = buildAllPartialSDVCSubjectV1({structuralMaster})
      sdvcs.concat(partials)
    }

    return sdvcs
  } else {
    return [full]
  }
}

// TODO: Add functions for building the VCs from the built credential subjects
// Instead of returning an array above it'll probably be better to return an object that separate the different types of subjects
// {
//   full: FullSDVCSubjectV1
//   stucturalFull?: StucturalFullSDVCSubjectV1
//   stucturalPartials?: StucturalPartialSDVCSubjectV1[]
//   nodePropertyLists?: NodePropertyListSDVCSubjectV1[]
//   partials?: PartialSDVCSubjectV1[]
// }

// export type Compact<T> = T extends object ? {[K in keyof T]: T[K]} : T

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

type RecursiveNodeId<T> = T // Placeholder

const assignNodeIds = (x: any): RecursiveNodeId<any> => {
  if (Array.isArray(x)) {
    return x.map(assignNodeIds)
  } else if (typeof x === 'object') {
    return {...assignNodeIds(x), '@nodeId': uuid()}
  } else {
    return x
  }
}

const addNodeToAccumulator = (
  accumulator: StructuralMaster,
  sourceNode: ObjectGeneric,
  item: ObjectGeneric,
  property: string,
  opts: AccumulateStructureOptions,
) => {
  accumulator.edges.push({'@nodeId': sourceNode['@nodeId'], '@property': property, '@targetNodeId': item['@nodeId']})
  accumulateStructure(accumulator, item, opts)
}

const addPartialToAccumulator = (accumulator: StructuralMaster, node: ObjectGeneric, key: string, value: string | number | boolean) => {
  accumulator.partials.push({
    '@type': node['@type'],
    '@nodeId': node['@nodeId'],
    [key]: value,
  })
}

const accumulateStructure = (accumulator: StructuralMaster, node: ObjectGeneric, opts: AccumulateStructureOptions) => {
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
