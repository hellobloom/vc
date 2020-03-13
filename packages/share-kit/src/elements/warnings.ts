import warning from 'tiny-warning'

import {RequestData, RequestDataV0, RequestDataV1} from '../types'

const emittedWarnings: {[id: string]: {[message: string]: boolean}} = {}

// Small wrapper to make sure we don't flood the console with the same messages for the same instance
const singleWarning = (id: string, condition: boolean, message: string) => {
  // We need this extra wrapping to get better tree shaking
  if (process.env.NODE_ENV !== 'production') {
    if (!emittedWarnings[id]) emittedWarnings[id] = {}
    if (emittedWarnings[id][message]) return
    warning(condition, message)
    emittedWarnings[id][message] = true
  }
}

const isRequestDataV0 = (data: any): data is RequestDataV0 => {
  if (typeof data['version'] === 'number') return false

  return true
}

const isRequestDataV1 = (data: any): data is RequestDataV1 => {
  if (typeof data['version'] !== 'number') return false
  if (data['version'] !== 1) return false

  return true
}

export const validateRequestData = (id: string, data: RequestData) => {
  if (isRequestDataV0(data)) {
    singleWarning(id, false, 'This version of RequestData is deprecated. Please update to the V1 spec.')
  } else if (isRequestDataV1(data)) {
    if (data.action === 'credential') {
      singleWarning(id, data.responseVersion !== 1, 'When using CredRequestDataV1 you must set resposeVersion to `1`.')
    } else if (data.action === 'authentication') {
      singleWarning(id, data.responseVersion !== 0, 'When using AuthRequestDataV1 you must set resposeVersion to `0`.')
    }
  }
}
