export type Unvalidated<T> = {[key in keyof T]?: any}

export type ValidationSuccessResponse<T> = {
  kind: 'validated'
  data: T
}

export type ValidationInvalidParamResponse = {
  kind: 'invalid_param'
  message: string
}

export type ValidationResponse<T> = ValidationSuccessResponse<T> | ValidationInvalidParamResponse

export type Validator = ((value: any) => boolean) | ((value: any, data: any) => boolean)

export type Validations<T> = {
  [k in keyof T]: Validator | Validator[]
}

export type ValidateFn<T> = (data: Unvalidated<T>) => ValidationResponse<T>

export const genValidateFn = <T>(validations: Validations<T>): ValidateFn<T> => data => {
  try {
    Object.keys(validations).forEach(_fieldName => {
      const fieldName = _fieldName as keyof T
      if (data[fieldName] === undefined) {
        throw new Error(`Missing ${fieldName}`)
      }

      const validator: Validator | Validator[] = validations[fieldName]

      try {
        const outcome = validator instanceof Array ? validator.every(fn => fn(data[fieldName], data)) : validator(data[fieldName], data)
        if (!outcome) throw new Error(`Invalid ${fieldName}: ${JSON.stringify(data[fieldName])}`)
      } catch {
        throw new Error(`Invalid ${fieldName}: ${JSON.stringify(data[fieldName])}`)
      }
    })
  } catch (error) {
    return {
      kind: 'invalid_param',
      message: error.message,
    }
  }

  return {
    kind: 'validated',
    data: data as T,
  }
}
