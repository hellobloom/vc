import {validateDateTime} from './RFC3339DateTime'
import {Validator, ValidateFn, AsyncValidateFn, AsyncValidator, Unvalidated} from './validation'

export const isValid = <T>(validateFn: ValidateFn<T>) => (data: Unvalidated<T>): data is T => validateFn(data).kind === 'validated'

export const isAsyncValid = <T>(validateFn: AsyncValidateFn<T>) => async (data: Unvalidated<T>): Promise<boolean> =>
  (await validateFn(data)).kind === 'validated'

export const isUndefinedOr = (validator: Validator) => (value: any, data: any) => {
  if (typeof value === 'undefined') return true
  return validator(value, data)
}

export const isArrayOf = (validator: Validator, rejectEmpty = true) => (value: any, data?: any) => {
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

export const isNotEmptyString = (value: any) => typeof value === 'string' && value.trim() !== ''

export const isArrayOfNonEmptyStrings = isArrayOf(isNotEmptyString)

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
