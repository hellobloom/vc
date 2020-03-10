import {drawQRCode, Options} from '@bloomprotocol/qr'

import {appendQuery} from './append'
import {ClaimData, ClaimElementResult} from '../types'

// Slightly modified from: https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f
const copyDataToClipboard = (claimData: ClaimData) => {
  const selection = document.getSelection()
  const selected = !selection ? false : selection.rangeCount > 0 ? selection.getRangeAt(0) : false

  const textarea = document.createElement('textarea')
  textarea.value = `'${JSON.stringify(claimData)}'`
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'absolute'
  textarea.style.left = '-9999px'

  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)

  if (selected && selection) {
    selection.removeAllRanges()
    selection.addRange(selected)
  }
}

export const renderClaimQRCode = (config: {
  container: HTMLElement
  claimData: ClaimData
  qrOptions?: Partial<Options>
}): ClaimElementResult => {
  const canvas = document.createElement('canvas')
  config.container.append(canvas)

  config.claimData.url = appendQuery(config.claimData.url, {'claim-kit-from': 'qr'})
  canvas.onclick = () => copyDataToClipboard(config.claimData)

  const {update, remove} = drawQRCode(canvas, {data: config.claimData, options: config.qrOptions})

  return {
    update: updateConfig => {
      updateConfig.claimData.url = appendQuery(updateConfig.claimData.url, {'claim-kit-from': 'qr'})
      canvas.onclick = () => copyDataToClipboard(updateConfig.claimData)

      update({data: updateConfig.claimData, options: updateConfig.qrOptions})
    },
    remove,
  }
}
