import * as R from 'ramda'
import {uuid} from 'uuidv4'
import {
  // FullSDVCV1,
  // StructuralFullSDVCV1,
  // StructuralPartialSDVCV1,
  // NodePropertyListSDVCV1,
  // PartialSDVCV1,
  VCV1SelectiveFullSubject,
  VCV1SelectiveStructuralFullSubject,
  VCV1SelectiveStructuralPartialSubject,
  VCV1SelectiveNodePropertyListSubject,
  VCV1SelectivePartialSubject,
  SimpleThing,
  SelectiveStructuralMaster,
  ObjectGeneric,
  SelectiveStructureComponent,
  SelectiveNode,
  SelectiveEdge,
  VCV1Subject,
} from '@bloomprotocol/vc-common'

export const buildVCV1SelectiveFullSubject = async <Data extends SimpleThing>({
  credentialSubject,
}: {
  credentialSubject: VCV1Subject<Data>
}): Promise<VCV1SelectiveFullSubject<Data>> => {
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

export const buildSelectiveStructuralMasterV1 = <Data extends SimpleThing>({
  full,
  ...opts
}: {full: VCV1SelectiveFullSubject<Data>} & AccumulateStructureOptions): SelectiveStructuralMaster => {
  const accumulator: SelectiveStructuralMaster = {
    nodes: [],
    edges: [],
    nodePropertyLists: [],
    partials: [],
  }
  accumulateStructure(accumulator, full, opts)
  return accumulator
}

export const buildVCV1SelectiveStructuralFullSubject = ({
  structuralMaster,
}: {
  structuralMaster: SelectiveStructuralMaster
}): VCV1SelectiveStructuralFullSubject => ({
  id: uuid(),
  data: {
    '@type': 'VCStructure',
    nodes: structuralMaster.nodes,
    edges: structuralMaster.edges,
  },
})

export const buildAllVCV1SelectiveStructuralPartialSubject = ({
  structuralMaster,
}: {
  structuralMaster: SelectiveStructuralMaster
}): VCV1SelectiveStructuralPartialSubject[] => {
  const structuralPartials: VCV1SelectiveStructuralPartialSubject[] = []

  const props: Array<SelectiveStructureComponent> = ['nodes', 'edges']
  props.forEach((k: SelectiveStructureComponent) => {
    structuralMaster[k].forEach((i: SelectiveNode | SelectiveEdge) => {
      const structuralPartial: VCV1SelectiveStructuralPartialSubject = {
        id: uuid(),
        data:
          k === 'nodes'
            ? {
                '@type': 'VCStructure',
                nodes: [i] as [SelectiveNode],
              }
            : {
                '@type': 'VCStructure',
                edges: [i] as [SelectiveEdge],
              },
      }
      structuralPartials.push(structuralPartial)
    })
  })

  return structuralPartials
}

export const buildAllVCV1SelectiveNodePropertyListSubject = ({
  structuralMaster,
}: {
  structuralMaster: SelectiveStructuralMaster
}): VCV1SelectiveNodePropertyListSubject[] =>
  structuralMaster.nodePropertyLists.map(npl => ({
    id: uuid(),
    sdvcClass: 'NodePropertyList',
    data: {'@type': 'NodePropertyList', ...npl},
  }))

export const buildAllVCV1SelectivePartialSubject = ({
  structuralMaster,
}: {
  structuralMaster: SelectiveStructuralMaster
}): VCV1SelectivePartialSubject[] =>
  structuralMaster.partials.map(p => ({
    id: uuid(),
    data: p,
  }))

export const buildAllVCV1SelectiveSubject = async <Data extends SimpleThing>({
  credentialSubject,
  includeStructuralFull,
  includeStructuralPartial,
  includeNodePropertyList,
  includePartial,
}: {
  credentialSubject: VCV1Subject<Data>
  includeStructuralFull?: boolean
  includeStructuralPartial?: boolean
  includeNodePropertyList?: boolean
  includePartial?: boolean
}): Promise<(
  | VCV1SelectiveFullSubject<Data>
  | VCV1SelectiveStructuralFullSubject
  | VCV1SelectiveStructuralPartialSubject
  | VCV1SelectiveNodePropertyListSubject
  | VCV1SelectivePartialSubject
)[]> => {
  const full = await buildVCV1SelectiveFullSubject({credentialSubject})

  if (includeStructuralFull || includeStructuralPartial || includeNodePropertyList || includePartial) {
    const sdvcs: (
      | VCV1SelectiveFullSubject<Data>
      | VCV1SelectiveStructuralFullSubject
      | VCV1SelectiveStructuralPartialSubject
      | VCV1SelectiveNodePropertyListSubject
      | VCV1SelectivePartialSubject
    )[] = [full]

    const structuralMaster = buildSelectiveStructuralMasterV1({full, includeNodeTypes: true})

    if (includeStructuralFull || includeStructuralPartial) {
      const structuralFull = buildVCV1SelectiveStructuralFullSubject({structuralMaster})
      sdvcs.push(structuralFull)

      if (includeStructuralPartial) {
        const structuralPartials = buildAllVCV1SelectiveStructuralPartialSubject({structuralMaster})
        sdvcs.concat(structuralPartials)
      }
    }

    if (includeNodePropertyList) {
      const nodePropertyLists = buildAllVCV1SelectiveNodePropertyListSubject({structuralMaster})
      sdvcs.concat(nodePropertyLists)
    }

    if (includePartial) {
      const partials = buildAllVCV1SelectivePartialSubject({structuralMaster})
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
//   full: VCV1SelectiveFullSubject
//   stucturalFull?: StucturalVCV1SelectiveFullSubject
//   stucturalPartials?: StucturalVCV1SelectivePartialSubject[]
//   nodePropertyLists?: VCV1SelectiveNodePropertyListSubject[]
//   partials?: VCV1SelectivePartialSubject[]
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
  accumulator: SelectiveStructuralMaster,
  sourceNode: ObjectGeneric,
  item: ObjectGeneric,
  property: string,
  opts: AccumulateStructureOptions,
) => {
  accumulator.edges.push({'@nodeId': sourceNode['@nodeId'], '@property': property, '@targetNodeId': item['@nodeId']})
  accumulateStructure(accumulator, item, opts)
}

const addPartialToAccumulator = (
  accumulator: SelectiveStructuralMaster,
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

const accumulateStructure = (accumulator: SelectiveStructuralMaster, node: ObjectGeneric, opts: AccumulateStructureOptions) => {
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
