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

export const genAsyncValidateFn = <T>(validations: AsyncValidations<T>): AsyncValidateFn<T> => async data => {
  try {
    for (const _fieldName of Object.keys(validations)) {
      const fieldName = _fieldName as keyof T
      if (data[fieldName] === undefined) {
        throw new Error(`Missing ${fieldName}`)
      }

      const validator: AsyncValidator | AsyncValidator[] = validations[fieldName]

      try {
        let outcome = true

        if (validator instanceof Array) {
          for (const fn of validator) {
            outcome = await fn(data[fieldName], data)
            if (!outcome) break
          }
        } else {
          outcome = await validator(data[fieldName], data)
        }

        if (!outcome) throw new Error(`Invalid ${fieldName}: ${JSON.stringify(data[fieldName])}`)
      } catch {
        throw new Error(`Invalid ${fieldName}: ${JSON.stringify(data[fieldName])}`)
      }
    }
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

export const genValidateFn = <T>(validations: Validations<T>): ValidateFn<T> => data => {
  try {
    for (const _fieldName of Object.keys(validations)) {
      const fieldName = _fieldName as keyof T
      if (data[fieldName] === undefined) {
        throw new Error(`Missing ${fieldName}`)
      }

      const validator: Validator | Validator[] = validations[fieldName]

      try {
        let outcome = true

        if (validator instanceof Array) {
          for (const fn of validator) {
            outcome = fn(data[fieldName], data)
            if (!outcome) break
          }
        } else {
          outcome = validator(data[fieldName], data)
        }

        if (!outcome) throw new Error(`Invalid ${fieldName}: ${JSON.stringify(data[fieldName])}`)
      } catch {
        throw new Error(`Invalid ${fieldName}: ${JSON.stringify(data[fieldName])}`)
      }
    }
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
