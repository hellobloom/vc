import * as http from './http'
import {VCV1} from '@bloomprotocol/vc-common'

export const create = ({type, data}: {type: string; data: {}}) => http.post<{id: string}>('/api/v1/cred/create', {type, data})

export const getConfig = ({id}: {id: string}) => http.get<{claimVersion: 'v1'}>(`/api/v1/cred/${id}/get-config`)

export const getClaimedVC = ({id}: {id: string}) => http.get<{vc: VCV1}>(`/api/v1/cred/${id}/get-claimed-vc`)
