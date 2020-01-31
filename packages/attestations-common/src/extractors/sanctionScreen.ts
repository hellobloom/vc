import * as B from './base'
import {IBaseAttSanctionScreenData, IBaseAttSanctionScreen} from '../attestationData/v0'

const dataFields: Array<keyof IBaseAttSanctionScreenData> = ['id', 'name', 'dob', 'search_summary']
const searchSummaryFields: Array<keyof NonNullable<IBaseAttSanctionScreenData['search_summary']>> = [
  'hit_location',
  'hit_number',
  'lists',
  'score',
  'hits',
  'flag_type',
  'comment',
]

export const extractSanctionScreen = (
  a: IBaseAttSanctionScreen,
  valType: string,
):
  | IBaseAttSanctionScreenData
  | IBaseAttSanctionScreenData['id']
  | IBaseAttSanctionScreenData['name']
  | IBaseAttSanctionScreenData['dob']
  | IBaseAttSanctionScreenData['search_summary']
  | NonNullable<NonNullable<IBaseAttSanctionScreenData['search_summary']>['hits']>
  | string
  | number
  | null => {
  if (!a.data) {
    return null
  }

  const d = B.getFirst(a.data)

  if (valType === 'object') return d

  if (!d) return null

  if (dataFields.indexOf(valType as any) !== -1 && typeof d === 'object' && valType in d) {
    return d[valType as keyof IBaseAttSanctionScreenData]
  }

  if (searchSummaryFields.indexOf(valType as any) !== -1) {
    const s = d['search_summary']
    if (!s) return null
    return s[valType as keyof IBaseAttSanctionScreenData['search_summary']] || null
  }

  return null
}
