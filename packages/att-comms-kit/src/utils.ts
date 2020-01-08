import {validateDateTime} from './RFC3339DateTime'

export const isNotEmptyString = (value: any) => typeof value === 'string' && value.trim() !== ''

export const isArrayOfNonEmptyStrings = (value: any) => {
  if (!Array.isArray(value)) return false
  if (value.length === 0) return false
  return value.every(isNotEmptyString)
}

/**
 * Returns the value of `JSON.stringify` of a new object argument `obj`,
 * which is a copy of `obj`, but its properties are sorted using
 * `Array<string>.sort`.
 */
export const orderedStringify = (obj: {[i: string]: any}) => {
  const orderedObj: {[i: string]: any} = {}
  Object.keys(obj)
    .sort()
    .map(o => (orderedObj[o] = obj[o]))
  return JSON.stringify(orderedObj)
}

export const isValidRFC3339DateTime = (value: any): boolean => validateDateTime(value)
