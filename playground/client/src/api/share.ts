import * as http from './http'

export const createRequest = ({types}: {types: string[]}) => http.post<{id: string}>('/api/v1/share/create', {types})

export const getTypes = ({id}: {id: string}) => http.get<{types: string[]}>(`/api/v1/share/${id}/get-types`)

export const getSharedData = ({id}: {id: string}) => http.get<{types: string[]}>(`/api/v1/share/${id}/get-shared-data`)
