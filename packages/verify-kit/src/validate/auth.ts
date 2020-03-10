import {IVerifiableAuth} from '@bloomprotocol/vc-common'

import {validateVerifiableAuthResponseV0} from './v0'
import {ValidationResponse} from './shared/types'

type Version = 'v0'

type VersionToResponse = {
  v0: IVerifiableAuth
}

type ValidateVerifiableAuthOptions<V extends Version> = {
  version?: V
}

export const validateVerifiableAuthResponse = <V extends Version = 'v0'>(
  data: any,
  {version}: ValidateVerifiableAuthOptions<V> = {},
): ValidationResponse<VersionToResponse[V]> => {
  if (typeof version === 'undefined' || version === 'v0') {
    return validateVerifiableAuthResponseV0(data)
  } else {
    return {
      kind: 'invalid',
      errors: [
        {
          key: 'invalid_version',
          message: `Invalid version passed: ${version}`,
        },
      ],
    }
  }
}
