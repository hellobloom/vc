import {validateDateTime} from './RFC3339DateTime'
import {Validator, ValidateFn, AsyncValidateFn, AsyncValidator, Unvalidated} from './validation'

export const isValid = <T>(valideFn: ValidateFn<T>) => (data: Unvalidated<T>): data is T => {
  const outcome = valideFn(data)

  if (outcome.kind !== 'validated') {
    console.log(outcome.message, data)
  }

  return outcome.kind === 'validated'
}

export const isAsyncValid = <T>(valideFn: AsyncValidateFn<T>) => async (data: Unvalidated<T>): Promise<boolean> => {
  const outcome = await valideFn(data)

  if (outcome.kind !== 'validated') {
    console.log(outcome.message, data)
  }

  return outcome.kind === 'validated'
}

export const isUndefinedOr = (validator: Validator) => (value: any, data: any) => {
  if (typeof value === 'undefined') return true
  return validator(value, data)
}

export const isArrayOf = (validator: Validator, rejectEmpty = true): Validator => (value: any, data: any) => {
  if (!Array.isArray(value)) return false
  if (value.length === 0 && rejectEmpty) return false
  return value.every(value => validator(value, data))
}

export const isAsyncArrayOf = (validator: AsyncValidator, rejectEmpty = true): AsyncValidator => async (value: any, data: any) => {
  if (!Array.isArray(value)) return false
  if (value.length === 0 && rejectEmpty) return false

  let outcome = true

  for (const v of value) {
    outcome = await validator(v, data)
    if (!outcome) break
  }

  return outcome
}

export const isNotEmptyString: Validator = (value: any) => typeof value === 'string' && value.trim() !== ''

export const isArrayOfNonEmptyStrings: Validator = isArrayOf(isNotEmptyString)

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

export const isValidRFC3339DateTime: Validator = (value: any) => validateDateTime(value)
