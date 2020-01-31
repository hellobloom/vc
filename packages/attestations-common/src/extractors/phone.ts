import * as B from './base'
import {IBaseAttPhone, TPhoneNumberObj} from '../attestationData/v0'

export const extractPhone = (a: B.MaybeDS<IBaseAttPhone>, valType: string): string | null => {
  switch (valType) {
    case 'number':
      const result = B.getAttrOrStr<IBaseAttPhone, TPhoneNumberObj>(a, 'full')
      return B.stringOrNull(result)
    default:
      return null
  }
}
