import * as B from './base'
import {IBaseAttSSN, IBaseAttSSNData} from '../AttestationData'

export const extractSSN = (a: B.MaybeDS<IBaseAttSSN>, valType: string): string | null => {
  switch (valType) {
    case 'number':
      const result = B.getAttrOrStr<IBaseAttSSN, IBaseAttSSNData>(a, 'id')
      return B.stringOrNull(result)
    default:
      return null
  }
}
