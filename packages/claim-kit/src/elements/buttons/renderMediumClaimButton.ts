import {oneLine, stripIndents} from 'common-tags'
import {renderBloomLogo} from './renderBloomLogo'
import {MediumButtonType} from '../../types'

const renderStyle = (id: string, type: MediumButtonType) => {
  const style = document.createElement('style')

  let styleText = stripIndents(oneLine)`
    #${id} {
      background-color: #6262F6;
      color: #fff;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      padding: 7px 17px;
      box-sizing: border-box;
    }

    #${id}-text-and-logo {
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: center;
    }

    #${id}-logo {
      margin-right: 4px;
      height: 16px;
    }
  `

  if (['sign-up', 'log-in', 'verify'].indexOf(type) >= 0) {
    styleText += stripIndents(oneLine)`
      #${id}-text {
        margin-top: 2px;
      }
    `
  }

  style.append(styleText)

  return style
}

const renderText = (id: string, d: string, width: string, height: string) => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.id = `${id}-text`
  svg.setAttribute('width', width)
  svg.setAttribute('height', height)

  const text = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  text.setAttribute('d', d)
  text.setAttribute('fill', 'currentColor')
  text.setAttribute('fill-rulle', 'evenodd')

  svg.appendChild(text)

  return svg
}

/* tslint:disable:max-line-length */
const texts: {[k in MediumButtonType]: {d: string; width: string; height: string}} = {
  claim: {
    d:
      'M6.5 3.073c0 .617-.31 1.399-1.272 1.77 1.232.315 1.76 1.385 1.76 2.153 0 1.564-1.124 2.894-2.98 2.894H0V.44h3.738C5.418.439 6.5 1.454 6.5 3.073zM1.99 4.17h1.558c.515 0 .867-.411.867-.974 0-.59-.298-.987-.88-.987H1.99V4.17zm1.87 1.66H1.99v2.29H3.9c.664 0 1.003-.603 1.003-1.165 0-.535-.339-1.125-1.043-1.125zM8.397 0h1.882v9.89H8.397V0zm6.514 8.134c.786 0 1.436-.576 1.436-1.467 0-.865-.65-1.454-1.436-1.454-.772 0-1.422.59-1.422 1.454 0 .891.65 1.467 1.422 1.467zm0 1.866c-1.788 0-3.277-1.317-3.277-3.333 0-2.017 1.49-3.32 3.277-3.32 1.788 0 3.291 1.303 3.291 3.32 0 2.016-1.503 3.333-3.29 3.333zm7.544-1.866c.785 0 1.435-.576 1.435-1.467 0-.865-.65-1.454-1.435-1.454-.772 0-1.422.59-1.422 1.454 0 .891.65 1.467 1.422 1.467zm0 1.866c-1.788 0-3.278-1.317-3.278-3.333 0-2.017 1.49-3.32 3.278-3.32 1.787 0 3.29 1.303 3.29 3.32 0 2.016-1.503 3.333-3.29 3.333zm11.633-4.801c-.596 0-1.083.37-1.083 1.303V9.89h-1.883V6.433c-.013-.809-.5-1.234-1.043-1.234-.568 0-1.097.33-1.097 1.303V9.89H27.1V3.484h1.882v.933c.298-.672.976-1.056 1.653-1.056 1.002 0 1.68.384 2.031 1.125.61-1.002 1.45-1.139 1.896-1.139 1.504 0 2.438.974 2.438 2.908V9.89h-1.869V6.475c0-.837-.488-1.276-1.043-1.276z',
    width: '37',
    height: '10',
  },
}
/* tslint:enable:max-line-length */

const renderTextAndLogo = (id: string, type: MediumButtonType) => {
  const textAndLogo = document.createElement('span')
  textAndLogo.id = `${id}-text-and-logo`
  textAndLogo.appendChild(renderBloomLogo(id))

  const text = texts[type]

  textAndLogo.appendChild(renderText(id, text.d, text.width, text.height))

  return textAndLogo
}

export const renderMediumClaimButton = (id: string, anchor: HTMLAnchorElement, type: MediumButtonType) => {
  anchor.append(renderStyle(id, type))
  anchor.append(renderTextAndLogo(id, type))
}
