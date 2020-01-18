import {appendQuery} from './append'
import {renderSmallClaimButton} from './buttons/renderSmallClaimButton'
import {renderMediumClaimButton} from './buttons/renderMediumClaimButton'
import {renderLargeClaimButton} from './buttons/renderLargeClaimButton'
import {ClaimData, ClaimElementResult, ButtonOptions} from '../types'

const getLink = (claimData: ClaimData, callbackUrl: string) => {
  claimData.url = appendQuery(claimData.url, {'share-kit-from': 'button'})

  return `https://bloom.co/download?claim=${window.btoa(JSON.stringify(claimData))}&callback-url=${encodeURIComponent(callbackUrl)}`
}

const render = (id: string, anchor: HTMLAnchorElement, config: {claimData: ClaimData; buttonOptions: ButtonOptions}) => {
  anchor.href = getLink(config.claimData, config.buttonOptions.callbackUrl)

  // Clear all children
  while (anchor.lastChild) {
    anchor.removeChild(anchor.lastChild)
  }

  const buttonOptions = config.buttonOptions

  if (buttonOptions.size === 'sm') {
    renderSmallClaimButton(id, anchor, buttonOptions.type, buttonOptions.invert)
  } else if (buttonOptions.size === 'md') {
    renderMediumClaimButton(id, anchor, buttonOptions.type || 'claim')
  } else {
    renderLargeClaimButton(id, anchor, buttonOptions.type || 'claim')
  }
}

const generateId = () => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  let rand = ''
  for (let i = 0; i < 4; i++) {
    rand += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return `bloom-claim-element-${rand}`
}

export const renderClaimButton = (config: {
  container: HTMLElement
  claimData: ClaimData
  buttonOptions: ButtonOptions
  id?: string
}): ClaimElementResult => {
  const id = config.id || generateId()
  const anchor = document.createElement('a')
  config.container.appendChild(anchor)

  anchor.id = id
  anchor.target = '_blank'
  anchor.rel = 'norefferer noopener'

  render(id, anchor, config)

  return {
    update: updateConfig => {
      render(id, anchor, updateConfig)
    },
    remove: () => {
      anchor.remove()
    },
  }
}
