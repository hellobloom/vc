import * as B from './base'
import {IBaseAttPEPData, IBaseAttPEP} from '../attestationData/v0'

export const fields: Array<keyof IBaseAttPEPData> = ['date', 'name', 'country', 'search_summary']
export const ssfields: Array<keyof IBaseAttPEPData['search_summary']> = [
  'hit_location',
  'hit_number',
  'lists',
  'record_id',
  'search_reference_id',
  'score',
  'hits',
  'flag_type',
  'comment',
]

export const extractPEP = (
  a: IBaseAttPEP,
  valType: string,
):
  | IBaseAttPEPData
  | IBaseAttPEPData['date']
  | IBaseAttPEPData['name']
  | IBaseAttPEPData['search_summary']
  | IBaseAttPEPData['search_summary']['lists']
  | IBaseAttPEPData['search_summary']['hits']
  | string
  | number
  | null => {
  // Original spec
  if (typeof a.data === 'object') {
    const data: IBaseAttPEPData | null = B.getFirst(a.data)
    if (data === null) {
      return null
    }
    if (valType === 'object') {
      return data
    }
    if (typeof data === 'object') {
      // Since there's no overlap between 'fields' and 'ssfields' this just does a quick property lookup across both
      if ((fields as Array<string>).indexOf(valType) !== -1) {
        const pepKey = valType as keyof IBaseAttPEPData
        if (typeof data[pepKey] !== 'undefined') {
          if (pepKey === 'name') {
            return B.getNameString(data[pepKey])
          }
          return data[pepKey]
        } else {
          return null
        }
      } else {
        const ss = data.search_summary
        if (typeof ss === 'object') {
          if ((ssfields as Array<string>).indexOf(valType) !== -1) {
            const ssKey = valType as keyof IBaseAttPEPData['search_summary']
            if (typeof ss[ssKey] !== 'undefined') {
              return ss[ssKey]
            }
          }
        }
      }
    }
    return null
  }
  return null
}
