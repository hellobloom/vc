import {IVerifiableAuth} from '@bloomprotocol/attestations-common'

import {validateVerifiableAuth} from './structure/auth'
import {ValidationResponse} from '../shared/types'

export const validateVerifiableAuthResponseV0 = (data: any): ValidationResponse<IVerifiableAuth> => {
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
