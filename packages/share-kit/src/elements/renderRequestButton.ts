import {appendQuery} from './append'
import {renderSmallRequestButton} from './buttons/renderSmallRequestButton'
import {renderMediumRequestButton} from './buttons/renderMediumRequestButton'
import {renderLargeRequestButton} from './buttons/renderLargeRequestButton'
import {generateId} from './utils'
import {validateRequestData} from './warnings'
import {RequestData, RequestElementResult, ButtonOptions} from '../types'

const getLink = (requestData: RequestData, callbackUrl: string) => {
  requestData.url = appendQuery(requestData.url, {'share-kit-from': 'button'})

  return `https://bloom.co/download?request=${window.btoa(JSON.stringify(requestData))}&callback-url=${encodeURIComponent(callbackUrl)}`
}

const render = (id: string, anchor: HTMLAnchorElement) => (config: {requestData: RequestData; buttonOptions: ButtonOptions}) => {
  validateRequestData(id, config.requestData)
  anchor.href = getLink(config.requestData, config.buttonOptions.callbackUrl)

  // Clear all children
  while (anchor.lastChild) {
    anchor.removeChild(anchor.lastChild)
  }

  const buttonOptions = config.buttonOptions

  if (buttonOptions.size === 'sm') {
    renderSmallRequestButton(id, anchor, buttonOptions.type, buttonOptions.invert)
  } else if (buttonOptions.size === 'md') {
    renderMediumRequestButton(id, anchor, buttonOptions.type || 'verify')
  } else {
    renderLargeRequestButton(id, anchor, buttonOptions.type || 'verify')
  }
}

export const renderRequestButton = (config: {
  container: HTMLElement
  requestData: RequestData
  buttonOptions: ButtonOptions
  id?: string
}): RequestElementResult => {
  const id = config.id || generateId()
  const anchor = document.createElement('a')
  config.container.appendChild(anchor)

  anchor.id = id
  anchor.target = '_blank'
  anchor.rel = 'norefferer noopener'

  render(id, anchor)(config)

  return {
    update: render(id, anchor),
    remove: () => anchor.remove(),
  }
}
