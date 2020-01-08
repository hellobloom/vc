import {IVerifiableAuth} from '@bloomprotocol/att-comms-kit'

import {validateVerifiableAuth} from './structure/auth'
import {ValidationResponse} from './utils'

export const validateVerifiableAuthResponse = (data: any): ValidationResponse<IVerifiableAuth> => {
  const outcome = validateVerifiableAuth(data)

  if (outcome.kind === 'invalid_param') {
    return {
      kind: 'invalid',
      errors: [{key: outcome.kind, message: outcome.message}],
    }
  }

  return {
    kind: 'validated',
    data: outcome.data,
  }
}
