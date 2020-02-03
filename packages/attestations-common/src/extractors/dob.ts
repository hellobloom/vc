import * as B from './base'
import {IBaseAttDOB} from '../types/data/v0'

export const extractDOB = (a: B.MaybeDS<IBaseAttDOB>, valType: string): string | null => {
  switch (valType) {
    case 'dob':
      if (typeof a === 'string') {
        return B.getDateString(a)
      } else if (typeof a === 'object') {
        return B.getDateString(a.data)
      } else {
        return null
      }
    default:
      return null
  }
}
