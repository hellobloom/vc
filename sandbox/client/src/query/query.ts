import {QueryOptions, QueryResult} from 'react-query'

export type WithVariables<TResult, TVariables extends object> = (
  variables: TVariables | null,
  options?: QueryOptions<TResult>,
) => QueryResult<TResult, TVariables>

export type WithoutVariables<TResult> = (options?: QueryOptions<TResult>) => QueryResult<TResult, never>

export type PrefetchWithVariables<TResult, TVariables extends object> = (
  variables: TVariables,
  options?: QueryOptions<TResult>,
) => Promise<TResult>

export type PrefetchWithoutVariables<TResult> = (options?: QueryOptions<TResult>) => Promise<TResult>
