import {useQuery} from 'react-query'

import {api} from '../api'
import {WithVariables} from './query'

export const useShareGetTypes: WithVariables<{types: string[]}, {id: string}> = (variables, options) => {
  return useQuery(variables && ['share.getTypes', variables], api.share.getTypes, options)
}
