import * as B from './base'
import {IBaseAttAccount, IBaseAttAccountData, TPersonalNameObj} from '../types/data/v0'

export const fields: Array<keyof IBaseAttAccountData> = ['id', 'email', 'name', 'start_date', 'end_date']

export const extractAccount = (a: IBaseAttAccount, valType: string): IBaseAttAccountData | TPersonalNameObj | string | number | null => {
  // Get first provider
  const account: IBaseAttAccountData | null = B.getFirst(a.data)
  if (account) {
    if (valType === 'object') {
      return account
    } else if (account && typeof account === 'object' && valType in account) {
      const accountKey = valType as keyof IBaseAttAccountData
      const val = account[accountKey]
      if (typeof val === 'undefined') {
        return null
      }
      if (accountKey === 'name' && typeof val === 'object') {
        return B.getNameString(val)
      }
      return val
    }
  }
  return null
}
