import * as http from './http'

export const createRequest = ({types}: {types: string[]}) => http.post<{id: string}>(`/api/share/create`, {types})

export const getTypes = ({id}: {id: string}) => http.get<{types: string[]}>(`/api/share/${id}/get-types`)

export const getSharedData = ({id}: {id: string}) => http.get<{types: string[]}>(`/api/share/${id}/get-shared-data`)
