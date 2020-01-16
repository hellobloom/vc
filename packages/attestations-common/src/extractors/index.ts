import {MaybeDS, parseDataStr} from './base'
import {extractAccount} from './account'
import {extractAddress} from './address'
import {extractAssets} from './assets'
import {extractDOB} from './dob'
import {extractEmail} from './email'
import {extractGender} from './gender'
import {extractIDDoc} from './idDocument'
import {extractIncome} from './income'
import {extractName} from './name'
import {extractPEP} from './pep'
import {extractPhone} from './phone'
import {extractSanctionScreen} from './sanctionScreen'
import {extractSSN} from './ssn'
import {extractUtility} from './utility'
import {
  IBaseAtt,
  IBaseAttPhone,
  IBaseAttEmail,
  IBaseAttName,
  IBaseAttSSN,
  IBaseAttDOB,
  IBaseAttAccount,
  IBaseAttSanctionScreen,
  IBaseAttPEP,
  IBaseAttIDDoc,
  IBaseAttUtility,
  IBaseAttAddress,
  IBaseAttIncome,
  IBaseAttAssets,
  IBaseAttGender,
} from '../AttestationData'
import {TAttestationTypeNames} from '../types'

export const extract = (dataStr: string, attType: TAttestationTypeNames, valType: string, errCallback?: (err: any) => void) => {
  const a: string | IBaseAtt | null = parseDataStr(dataStr)
  if (a === null) return a

  let val: any = null
  try {
    switch (attType) {
      case 'phone':
        val = extractPhone(a as MaybeDS<IBaseAttPhone>, valType)
        break
      case 'email':
        val = extractEmail(a as MaybeDS<IBaseAttEmail>, valType)
        break
      case 'full-name':
        val = extractName(a as MaybeDS<IBaseAttName>, valType)
        break
      case 'ssn':
        val = extractSSN(a as MaybeDS<IBaseAttSSN>, valType)
        break
      case 'birth-date':
        val = extractDOB(a as MaybeDS<IBaseAttDOB>, valType)
        break
      case 'account':
        val = extractAccount(a as IBaseAttAccount, valType)
        break
      case 'sanction-screen':
        val = extractSanctionScreen(a as IBaseAttSanctionScreen, valType)
        break
      case 'pep-screen':
        val = extractPEP(a as IBaseAttPEP, valType)
        break
      case 'id-document':
        val = extractIDDoc(a as IBaseAttIDDoc, valType)
        break
      case 'utility':
        val = extractUtility(a as IBaseAttUtility, valType)
        break
      case 'address':
        val = extractAddress(a as IBaseAttAddress, valType)
        break
      case 'income':
        val = extractIncome(a as IBaseAttIncome, valType)
        break
      case 'assets':
        val = extractAssets(a as IBaseAttAssets, valType)
        break
      case 'gender':
        val = extractGender(a as IBaseAttGender, valType)
        break
      default:
        return null
    }
  } catch (err) {
    if (typeof errCallback === 'function') {
      errCallback(err)
    }
    return null
  }
  if (typeof val === 'undefined') {
    val = null
  }
  return val
}
