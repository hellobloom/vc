export type ValidationSuccessResponse<T> = {
  kind: 'validated'
  data: T
}

export type ValidationError = {
  key: string
  message: string
}

export type ValidationInvalidParamResponse = {
  kind: 'invalid'
  errors: ValidationError[]
}

export type ValidationResponse<T> = ValidationSuccessResponse<T> | ValidationInvalidParamResponse
