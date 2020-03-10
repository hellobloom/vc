import Bowser from 'bowser'
import {Options as QROptions} from '@bloomprotocol/qr'

import {ButtonOptions, ClaimData, ShouldRenderButton, ClaimElementResult} from './types'
import {renderClaimButton} from './elements/renderClaimButton'
import {renderClaimQRCode} from './elements/renderClaimQRCode'

const renderClaimElement = (config: {
  container: HTMLElement
  claimData: ClaimData
  qrOptions?: Partial<QROptions>
  shouldRenderButton?: ShouldRenderButton
  buttonOptions: ButtonOptions
}): ClaimElementResult => {
  let renderButton: boolean

  if (typeof config.shouldRenderButton === 'undefined') {
    const parsedResult = Bowser.parse(window.navigator.userAgent)
    const isSupportedPlatform = parsedResult.platform.type === 'mobile' || parsedResult.platform.type === 'tablet'
    const isSupportedOS = parsedResult.os.name === 'iOS' || parsedResult.os.name === 'Android'

    renderButton = isSupportedPlatform && isSupportedOS
  } else if (typeof config.shouldRenderButton === 'boolean') {
    renderButton = config.shouldRenderButton
  } else {
    renderButton = config.shouldRenderButton(Bowser.parse(window.navigator.userAgent))
  }

  return (renderButton ? renderClaimButton : renderClaimQRCode)(config)
}

export {renderClaimElement}
