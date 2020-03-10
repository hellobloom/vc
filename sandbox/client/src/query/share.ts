import {useQuery} from 'react-query'

import {api} from '../api'
import {WithVariables} from './query'

export const useShareGetConfig: WithVariables<{types: string[]; responseVersion: 'v0' | 'v1'}, {id: string}> = (variables, options) => {
  return useQuery(variables && ['share.getConfig', variables], api.share.getConfig, options)
}
