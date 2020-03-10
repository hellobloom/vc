import {oneLine, stripIndents} from 'common-tags'

import {renderBloomLogo} from './renderBloomLogo'
import {LargeButtonType} from './../../types'

const backgroundPattern = `
  <svg width="281" height="48"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
      <rect id="a" width="335" height="48" rx="4"/>
      <path d="M0 0h281c13.254834 0 24 10.745166 24 24s-10.745166 24-24 24H0V0z" id="c"/>
      <linearGradient x1="83.3806005%" y1="6.01770792%" x2="130.86599%" y2="100%" id="d">
        <stop stop-color="#7A7CF3" offset="0%"/>
        <stop stop-color="#6262F6" offset="100%"/>
      </linearGradient>
      <path d="M0 0h281c13.254834 0 24 10.745166 24 24s-10.745166 24-24 24H0V0z" id="f"/>
      <path d="M0 0h281c13.254834 0 24 10.745166 24 24s-10.745166 24-24 24H0V0z" id="h"/>
      <path d="M0 0h281c13.254834 0 24 10.745166 24 24s-10.745166 24-24 24H0V0z" id="j"/>
      <path d="M0 0h281c13.254834 0 24 10.745166 24 24s-10.745166 24-24 24H0V0z" id="l"/>
      <path d="M0 0h281c13.254834 0 24 10.745166 24 24s-10.745166 24-24 24H0V0z" id="n"/>
      <path d="M0 0h281c13.254834 0 24 10.745166 24 24s-10.745166 24-24 24H0V0z" id="p"/>
      <path d="M0 0h281c13.254834 0 24 10.745166 24 24s-10.745166 24-24 24H0V0z" id="r"/>
      <path d="M0 0h226c13.254834 0 24 10.745166 24 24s-10.745166 24-24 24H0V0z" id="t"/>
      <path d="M0 0h226c13.254834 0 24 10.745166 24 24s-10.745166 24-24 24H0V0z" id="v"/>
      <path d="M0 0h226c13.254834 0 24 10.745166 24 24s-10.745166 24-24 24H0V0z" id="x"/>
      <path d="M0 0h226c13.254834 0 24 10.745166 24 24s-10.745166 24-24 24H0V0z" id="z"/>
      <path d="M0 0h226c13.254834 0 24 10.745166 24 24s-10.745166 24-24 24H0V0z" id="B"/>
      <path d="M0 0h226c13.254834 0 24 10.745166 24 24s-10.745166 24-24 24H0V0z" id="D"/>
      <path d="M0 0h226c13.254834 0 24 10.745166 24 24s-10.745166 24-24 24H0V0z" id="F"/>
      <path d="M0 0h226c13.254834 0 24 10.745166 24 24s-10.745166 24-24 24H0V0z" id="H"/>
      <path d="M0 0h226c13.254834 0 24 10.745166 24 24s-10.745166 24-24 24H0V0z" id="J"/>
      <path d="M0 0h226c13.254834 0 24 10.745166 24 24s-10.745166 24-24 24H0V0z" id="L"/>
      <path d="M0 0h226c13.254834 0 24 10.745166 24 24s-10.745166 24-24 24H0V0z" id="N"/>
      <path d="M0 0h226c13.254834 0 24 10.745166 24 24s-10.745166 24-24 24H0V0z" id="P"/>
      <path d="M0 0h226c13.254834 0 24 10.745166 24 24s-10.745166 24-24 24H0V0z" id="R"/>
      <path d="M0 0h226c13.254834 0 24 10.745166 24 24s-10.745166 24-24 24H0V0z" id="T"/>
      <path d="M0 0h226c13.254834 0 24 10.745166 24 24s-10.745166 24-24 24H0V0z" id="V"/>
      <path d="M0 0h144.64C153.123094 0 160 10.745166 160 24s-6.876906 24-15.36 24H0V0z" id="X"/>
    </defs>
    <g transform="translate(-41)" fill="none" fill-rule="evenodd">
      <mask id="b" fill="#fff">
        <use xlink:href="#a"/>
      </mask>
      <g mask="url(#b)">
        <g transform="translate(41)">
          <mask id="e" fill="#fff">
            <use xlink:href="#c"/>
          </mask>
          <circle stroke="url(#d)" stroke-width="2" mask="url(#e)" cx="-3" cy="24" r="25"/>
        </g>
        <g transform="translate(41)">
          <mask id="g" fill="#fff">
            <use xlink:href="#f"/>
          </mask>
          <circle stroke="url(#d)" stroke-width="2" mask="url(#g)" cx="1" cy="24" r="27"/>
        </g>
        <g transform="translate(41)">
          <mask id="i" fill="#fff">
            <use xlink:href="#h"/>
          </mask>
          <circle stroke="url(#d)" stroke-width="2" mask="url(#i)" cx="5" cy="24" r="29"/>
        </g>
        <g transform="translate(41)">
          <mask id="k" fill="#fff">
            <use xlink:href="#j"/>
          </mask>
          <circle stroke="url(#d)" stroke-width="2" opacity=".8" mask="url(#k)" cx="9" cy="24" r="31"/>
        </g>
        <g transform="translate(41)">
          <mask id="m" fill="#fff">
            <use xlink:href="#l"/>
          </mask>
          <circle stroke="url(#d)" stroke-width="2" opacity=".8" mask="url(#m)" cx="13" cy="24" r="33"/>
        </g>
        <g transform="translate(41)">
          <mask id="o" fill="#fff">
            <use xlink:href="#n"/>
          </mask>
          <circle stroke="url(#d)" stroke-width="2" opacity=".7" mask="url(#o)" cx="18" cy="24" r="34"/>
        </g>
        <g transform="translate(41)">
          <mask id="q" fill="#fff">
            <use xlink:href="#p"/>
          </mask>
          <circle stroke="url(#d)" stroke-width="2" opacity=".7" mask="url(#q)" cx="23" cy="24" r="35"/>
        </g>
        <g transform="translate(41)">
          <mask id="s" fill="#fff">
            <use xlink:href="#r"/>
          </mask>
          <g mask="url(#s)">
            <g transform="translate(55)">
              <mask id="u" fill="#fff">
                <use xlink:href="#t"/>
              </mask>
              <circle stroke="url(#d)" stroke-width="2" opacity=".6" mask="url(#u)" cx="-27" cy="24" r="36"/>
            </g>
            <g transform="translate(55)">
              <mask id="w" fill="#fff">
                <use xlink:href="#v"/>
              </mask>
              <circle stroke="url(#d)" stroke-width="2" opacity=".6" mask="url(#w)" cx="-22" cy="24" r="37"/>
            </g>
            <g transform="translate(55)">
              <mask id="y" fill="#fff">
                <use xlink:href="#x"/>
              </mask>
              <circle stroke="url(#d)" stroke-width="2" opacity=".6" mask="url(#y)" cx="-17" cy="24" r="38"/>
            </g>
            <g transform="translate(55)">
              <mask id="A" fill="#fff">
                <use xlink:href="#z"/>
              </mask>
              <circle stroke="url(#d)" stroke-width="2" opacity=".55" mask="url(#A)" cx="-12" cy="24" r="39"/>
            </g>
            <g transform="translate(55)">
              <mask id="C" fill="#fff">
                <use xlink:href="#B"/>
              </mask>
              <circle stroke="url(#d)" stroke-width="2" opacity=".55" mask="url(#C)" cx="-7" cy="24" r="40"/>
            </g>
            <g transform="translate(55)">
              <mask id="E" fill="#fff">
                <use xlink:href="#D"/>
              </mask>
              <circle stroke="url(#d)" stroke-width="2" opacity=".55" mask="url(#E)" cx="-2" cy="24" r="41"/>
            </g>
            <g transform="translate(55)">
              <mask id="G" fill="#fff">
                <use xlink:href="#F"/>
              </mask>
              <circle stroke="url(#d)" stroke-width="2" opacity=".55" mask="url(#G)" cx="3" cy="24" r="42"/>
            </g>
            <g transform="translate(55)">
              <mask id="I" fill="#fff">
                <use xlink:href="#H"/>
              </mask>
              <circle stroke="url(#d)" stroke-width="2" opacity=".55" mask="url(#I)" cx="8" cy="24" r="43"/>
            </g>
            <g transform="translate(55)">
              <mask id="K" fill="#fff">
                <use xlink:href="#J"/>
              </mask>
              <circle stroke="url(#d)" stroke-width="2" opacity=".5" mask="url(#K)" cx="13" cy="24" r="44"/>
            </g>
            <g transform="translate(55)">
              <mask id="M" fill="#fff">
                <use xlink:href="#L"/>
              </mask>
              <circle stroke="url(#d)" stroke-width="2" opacity=".5" mask="url(#M)" cx="18" cy="24" r="45"/>
            </g>
            <g transform="translate(55)">
              <mask id="O" fill="#fff">
                <use xlink:href="#N"/>
              </mask>
              <circle stroke="url(#d)" stroke-width="2" opacity=".5" mask="url(#O)" cx="23" cy="24" r="46"/>
            </g>
            <g transform="translate(55)">
              <mask id="Q" fill="#fff">
                <use xlink:href="#P"/>
              </mask>
              <circle stroke="url(#d)" stroke-width="2" opacity=".5" mask="url(#Q)" cx="28" cy="24" r="47"/>
            </g>
            <g transform="translate(55)">
              <mask id="S" fill="#fff">
                <use xlink:href="#R"/>
              </mask>
              <circle stroke="url(#d)" stroke-width="2" opacity=".5" mask="url(#S)" cx="33" cy="24" r="48"/>
            </g>
            <g transform="translate(55)">
              <mask id="U" fill="#fff">
                <use xlink:href="#T"/>
              </mask>
              <circle stroke="url(#d)" stroke-width="2" opacity=".45" mask="url(#U)" cx="38" cy="24" r="49"/>
            </g>
            <g transform="translate(55)">
              <mask id="W" fill="#fff">
                <use xlink:href="#V"/>
              </mask>
              <circle stroke="url(#d)" stroke-width="2" opacity=".45" mask="url(#W)" cx="43" cy="24" r="50"/>
            </g>
            <g transform="translate(145)">
              <mask id="Y" fill="#fff">
                <use xlink:href="#X"/>
              </mask>
              <g mask="url(#Y)">
                <g stroke="url(#d)" stroke-width="2" transform="translate(-105 -66)">
                  <circle opacity=".45" transform="rotate(15 63 90)" cx="63" cy="90" r="51"/>
                  <circle opacity=".45" transform="rotate(15 68 90)" cx="68" cy="90" r="52"/>
                  <circle opacity=".45" transform="rotate(15 73 90)" cx="73" cy="90" r="53"/>
                  <circle opacity=".45" transform="rotate(15 78 90)" cx="78" cy="90" r="54"/>
                  <circle opacity=".4" transform="rotate(15 83 90)" cx="83" cy="90" r="55"/>
                  <circle opacity=".4" transform="rotate(15 88 90)" cx="88" cy="90" r="56"/>
                  <circle opacity=".4" transform="rotate(15 93 90)" cx="93" cy="90" r="57"/>
                  <circle opacity=".4" transform="rotate(15 98 90)" cx="98" cy="90" r="58"/>
                  <circle opacity=".4" transform="rotate(15 103 90)" cx="103" cy="90" r="59"/>
                  <circle opacity=".35" transform="rotate(15 108 90)" cx="108" cy="90" r="60"/>
                  <circle opacity=".35" transform="rotate(15 113 90)" cx="113" cy="90" r="61"/>
                  <circle opacity=".35" transform="rotate(15 118 89)" cx="118" cy="89" r="62"/>
                  <circle opacity=".35" transform="rotate(15 123 89)" cx="123" cy="89" r="63"/>
                  <circle opacity=".3" transform="rotate(15 128 89)" cx="128" cy="89" r="64"/>
                  <circle opacity=".3" transform="rotate(15 133 89)" cx="133" cy="89" r="65"/>
                  <circle opacity=".3" transform="rotate(15 138 89)" cx="138" cy="89" r="66"/>
                  <circle opacity=".25" transform="rotate(15 143 89)" cx="143" cy="89" r="67"/>
                  <circle opacity=".25" transform="rotate(15 148 89)" cx="148" cy="89" r="68"/>
                  <circle opacity=".2" transform="rotate(15 153 89)" cx="153" cy="89" r="69"/>
                  <circle opacity=".2" transform="rotate(15 158 89)" cx="158" cy="89" r="70"/>
                  <circle opacity=".2" transform="rotate(15 163 89)" cx="163" cy="89" r="71"/>
                  <circle opacity=".2" transform="rotate(15 168 89)" cx="168" cy="89" r="72"/>
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
  </svg>`

const renderStyle = (id: string, type: LargeButtonType) => {
  const style = document.createElement('style')

  let styleText = stripIndents(oneLine)`
    #${id} {
      position: relative;
      background-image: url(data:image/svg+xml;base64,${window.btoa(backgroundPattern)}), linear-gradient(to right, #7A7CF3, #6262F6);
      background-repeat: no-repeat;
      background-position: left 39px center, left center;
      background-size: 282px 100%, 100% 100%;
      box-shadow: 0 4px 15px 0 rgba(98,98,246,0.50);
      color: #fff;
      text-decoration: none;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      padding: 12px 39px;
      box-sizing: border-box;
    }

    #${id}-lock {
      position: absolute;
      left: 19px;
      top: 50%;
      transform: translateY(-50%);
      height: 20px;
      color: #5a5de0;
    }

    #${id}-text-and-logo {
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: center;
      margin-left: 12px;
      margin-right: 12px;
    }

    #${id}-logo {
      margin-right: 6px;
      height: 22px;
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

/* tslint:disable:max-line-length */
const renderLockIcon = (id: string) => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.id = `${id}-lock`
  svg.setAttribute('viewBox', '0 0 24 24')

  const lock = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  lock.setAttribute(
    'd',
    'M19.5 9.5h-.75V6.75a6.75 6.75 0 0 0-13.5 0V9.5H4.5a2 2 0 0 0-2 2V22a2 2 0 0 0 2 2h15a2 2 0 0 0 2-2V11.5a2 2 0 0 0-2-2zm-9.5 6a2 2 0 1 1 3 1.723V19.5a1 1 0 0 1-2 0v-2.277a1.994 1.994 0 0 1-1-1.723zM7.75 6.75a4.25 4.25 0 0 1 8.5 0V9a.5.5 0 0 1-.5.5h-7.5a.5.5 0 0 1-.5-.5z',
  )
  lock.setAttribute('fill', 'currentColor')

  svg.appendChild(lock)

  return svg
}
/* tslint:enable:max-line-length */

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

const texts: {[k in LargeButtonType]: {d: string; width: string; height: string}} = {
  claim: {
    d:
      'M7.68 3.584c0 .72-.368 1.632-1.504 2.064 1.456.368 2.08 1.616 2.08 2.512 0 1.824-1.328 3.376-3.52 3.376H0V.512h4.416C6.4.512 7.68 1.696 7.68 3.584zm-5.328 1.28h1.84c.608 0 1.024-.48 1.024-1.136 0-.688-.352-1.152-1.04-1.152H2.352v2.288zM4.56 6.8H2.352v2.672h2.256c.784 0 1.184-.704 1.184-1.36 0-.624-.4-1.312-1.232-1.312zM9.92 0h2.224v11.536H9.92V0zm7.696 9.488c.928 0 1.696-.672 1.696-1.712 0-1.008-.768-1.696-1.696-1.696-.912 0-1.68.688-1.68 1.696 0 1.04.768 1.712 1.68 1.712zm0 2.176c-2.112 0-3.872-1.536-3.872-3.888s1.76-3.872 3.872-3.872 3.888 1.52 3.888 3.872-1.776 3.888-3.888 3.888zm8.912-2.176c.928 0 1.696-.672 1.696-1.712 0-1.008-.768-1.696-1.696-1.696-.912 0-1.68.688-1.68 1.696 0 1.04.768 1.712 1.68 1.712zm0 2.176c-2.112 0-3.872-1.536-3.872-3.888s1.76-3.872 3.872-3.872 3.888 1.52 3.888 3.872-1.776 3.888-3.888 3.888zm13.744-5.6c-.704 0-1.28.432-1.28 1.52v3.952h-2.224V7.504c-.016-.944-.592-1.44-1.232-1.44-.672 0-1.296.384-1.296 1.52v3.952h-2.224V4.064h2.224v1.088c.352-.784 1.152-1.232 1.952-1.232 1.184 0 1.984.448 2.4 1.312.72-1.168 1.712-1.328 2.24-1.328 1.776 0 2.88 1.136 2.88 3.392v4.24h-2.208V7.552c0-.976-.576-1.488-1.232-1.488z',
    width: '44',
    height: '12',
  },
}
/* tslint:enable:max-line-length */

const renderTextAndLogo = (id: string, type: LargeButtonType) => {
  const textAndLogo = document.createElement('span')
  textAndLogo.id = `${id}-text-and-logo`
  textAndLogo.appendChild(renderBloomLogo(id))

  const text = texts[type]

  textAndLogo.appendChild(renderText(id, text.d, text.width, text.height))

  return textAndLogo
}

export const renderLargeClaimButton = (id: string, anchor: HTMLAnchorElement, type: LargeButtonType) => {
  anchor.appendChild(renderStyle(id, type))
  anchor.appendChild(renderLockIcon(id))
  anchor.appendChild(renderTextAndLogo(id, type))
}
