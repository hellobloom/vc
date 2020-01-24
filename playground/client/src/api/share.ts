import * as http from './http'

export const create = ({types, responseVersion}: {types: string[]; responseVersion: string}) =>
  http.post<{id: string}>('/api/v1/share/create', {types, responseVersion})

export const getConfig = ({id}: {id: string}) => http.get<{types: string[]; responseVersion: 'v0' | 'v1'}>(`/api/v1/share/${id}/get-config`)

export const getSharedData = ({id}: {id: string}) => http.get<{verifiableCredential: []}>(`/api/v1/share/${id}/get-shared-data`)
