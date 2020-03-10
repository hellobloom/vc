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

export type AsyncValidator = Validator | (((value: any) => Promise<boolean>) | ((value: any, data: any) => Promise<boolean>))

type OneOrMore<T> = T | T[]

export type Validations<T> = {
  [k in keyof T]: OneOrMore<Validator>
}

export type AsyncValidations<T> = {
  [k in keyof T]: OneOrMore<AsyncValidator>
}

export type ValidateFn<T> = (data: Unvalidated<T>) => ValidationResponse<T>

export type AsyncValidateFn<T> = (data: Unvalidated<T>) => Promise<ValidationResponse<T>>

export const genAsyncValidateFn = <T>(
  validations: AsyncValidations<T>,
  {required: _required}: {required?: (keyof T)[]} = {},
): AsyncValidateFn<T> => async data => {
  const required = _required || []

  try {
    for (let i = 0; i < Object.keys(validations).length; i++) {
      const fieldName = Object.keys(validations)[i] as keyof T

      if (required.includes(fieldName) && typeof data[fieldName] === 'undefined') {
        throw new Error(`Missing ${fieldName}`)
      }

      const validator: AsyncValidator | AsyncValidator[] = validations[fieldName]
      const validators: AsyncValidator[] = validator instanceof Array ? validator : [validator]

      for (let i = 0; i < validators.length; i++) {
        const fn = validators[i]

        let outcome: boolean
        try {
          outcome = await fn(data[fieldName], data)
        } catch {
          throw new Error(`Error while validating ${fieldName}: ${JSON.stringify(data[fieldName])}`)
        }

        if (!outcome) {
          throw new Error(`Invalid ${fieldName}: ${JSON.stringify(data[fieldName])}`)
        }
      }
    }

    return {
      kind: 'validated',
      data: data as T,
    }
  } catch (error) {
    return {
      kind: 'invalid_param',
      message: error.message,
    }
  }
}

export const genValidateFn = <T>(
  validations: Validations<T>,
  {required: _required}: {required?: (keyof T)[]} = {},
): ValidateFn<T> => data => {
  const required = _required || []

  try {
    Object.keys(validations).forEach(_fieldName => {
      const fieldName = _fieldName as keyof T

      if (required.includes(fieldName) && typeof data[fieldName] === 'undefined') {
        throw new Error(`Missing ${fieldName}`)
      }

      const validator: Validator | Validator[] = validations[fieldName]
      const validators: Validator[] = validator instanceof Array ? validator : [validator]

      let outcome: boolean

      try {
        outcome = validators.every(fn => fn(data[fieldName], data))
      } catch {
        throw new Error(`Error while validating ${fieldName}: ${JSON.stringify(data[fieldName])}`)
      }

      if (!outcome) throw new Error(`Invalid ${fieldName}: ${JSON.stringify(data[fieldName])}`)
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
