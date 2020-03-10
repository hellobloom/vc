export type OnChain = {
  validateOnChain: true
  web3Provider: string
}

export type OffChain = {
  validateOnChain?: false
}

export type ChainOptions = OnChain | OffChain

export type SharedValidateVerifiablePresentationOptions = ChainOptions

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
