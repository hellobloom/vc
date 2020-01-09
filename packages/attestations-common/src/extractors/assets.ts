import * as B from './base'
import {IBaseAttAssets} from '../AttestationData'

export const extractAssets = (a: IBaseAttAssets, valType: string): IBaseAttAssets | string | number | null => {
  // Naive one-account implementation.  Will need future improvement, like adding together values with currency
  // conversions at time of attestation.
  const account = B.getFirst(a.data)
  if (!account) {
    return null
  }
  switch (valType) {
    case 'object':
      return a
    case 'value':
      return account.value || null
    case 'currency':
      return a.currency || null
    case 'institution_name':
      return account.institution_name || null
    case 'type':
      return account.type || null
    default:
      return null
  }
}
