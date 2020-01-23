import * as http from './http'

export const create = ({claimNodes}: {claimNodes: {type: string; version: string; provider: string; data: {}}[]}) =>
  http.post<{id: string}>('/api/v1/cred/create', {claimNodes})

export const getConfig = ({id}: {id: string}) => http.get<{claimVersion: 'v1'}>(`/api/v1/cred/${id}/get-config`)

export const getClaimedData = ({id}: {id: string}) => http.get<{claimNodes: []}>(`/api/v1/cred/${id}/get-claimed-data`)
