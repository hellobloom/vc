import {useQuery} from 'react-query'

import {api} from '../api'
import {WithVariables} from './query'

export const useCredGetConfig: WithVariables<{}, {id: string}> = (variables, options) => {
  return useQuery(variables && ['cred.getConfig', variables], api.cred.getConfig, options)
}
