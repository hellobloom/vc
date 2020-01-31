import * as B from './base'
import {IBaseAttEmail, IBaseAttEmailData} from '../attestationData/v0'

export const extractEmail = (a: B.MaybeDS<IBaseAttEmail>, valType: string): string | null => {
  switch (valType) {
    case 'email':
      const result = B.getAttrOrStr<IBaseAttEmail, IBaseAttEmailData>(a, 'email')
      return B.stringOrNull(result)
    default:
      return null
  }
}
