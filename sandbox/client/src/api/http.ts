import wretch, {ResponseChain} from 'wretch'

const api = async () => {
  return wretch().headers({
    credentials: 'same-origin',
    'Content-Type': 'application/json',
  })
}

const generic = async <T>(method: 'get' | 'delete' | 'post' | 'put' | 'patch', endpoint: string, body: {[k: string]: any} = {}) => {
  const controller = new AbortController()
  const wretcher = (await api()).signal(controller).url(endpoint)
  let resp: ResponseChain

  switch (method) {
    case 'get':
    case 'delete':
      resp = wretcher[method]()
      break
    case 'post':
    case 'put':
    case 'patch':
      resp = wretcher[method](body)
      break
    default:
      throw Error(`Unsupported method: ${method}`)
  }

  // This makes the fetch request cancelable by calling .cancel()
  const promise = resp.json<T>()
  ;(promise as any)['cancel'] = controller.abort

  return promise
}

export const post = async <T>(endpoint: string, body: {[k: string]: any} = {}) => generic<T>('post', endpoint, body)

export const get = async <T>(endpoint: string) => generic<T>('get', endpoint)

export const del = async <T>(endpoint: string) => generic<T>('delete', endpoint)

export const put = async <T>(endpoint: string, body: {[k: string]: any} = {}) => generic<T>('put', endpoint, body)

export const patch = async <T>(endpoint: string, body: {[k: string]: any} = {}) => generic<T>('patch', endpoint, body)
