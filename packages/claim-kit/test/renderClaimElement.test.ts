import {renderClaimElement} from '../src/renderClaimElement'
import {ShouldRenderButton} from '../src/types'

/* tslint:disable:max-line-length */
const userAgents = {
  iOS:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 12_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1',
  macOs: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
}
/* tslint:enable:max-line-length */

describe('renderClaimElement', () => {
  let container: HTMLElement
  let prevUserAgent: string

  beforeAll(() => {
    container = document.createElement('div')
    prevUserAgent = window.navigator.userAgent
  })

  afterAll(() => {
    container.remove()
    Object.defineProperty(window.navigator, 'userAgent', {value: prevUserAgent, writable: false})
  })

  const renderElem = (config: {userAgent: string; shouldRenderButton?: ShouldRenderButton; url?: string}) => {
    Object.defineProperty(window.navigator, 'userAgent', {value: config.userAgent, writable: true})
    const claimElement = renderClaimElement({
      container,
      claimData: {
        version: 1,
        url: config.url || 'https://claim-kit.bloom.co/api/claim',
        token: 'token',
      },
      shouldRenderButton: config.shouldRenderButton,
      buttonOptions: {
        callbackUrl: 'https://bloom.co/callback-url',
      },
    })

    return claimElement
  }

  test('renders a button on mobile', () => {
    const element = renderElem({userAgent: userAgents.iOS})

    expect(container.querySelector('a')).not.toBeNull()
    expect(container.querySelector('canvas')).toBeNull()

    element.remove()
  })

  test('renders a QR code on desktop', () => {
    const element = renderElem({userAgent: userAgents.macOs})

    expect(container.querySelector('canvas')).not.toBeNull()
    expect(container.querySelector('a')).toBeNull()

    element.remove()
  })

  test('renders a QR code on mobile with an overriden check', () => {
    const element = renderElem({userAgent: userAgents.iOS, shouldRenderButton: false})

    expect(container.querySelector('canvas')).not.toBeNull()
    expect(container.querySelector('a')).toBeNull()

    element.remove()
  })

  test('renders a button on desktop with an overriden check', () => {
    const element = renderElem({userAgent: userAgents.macOs, shouldRenderButton: true})

    expect(container.querySelector('a')).not.toBeNull()
    expect(container.querySelector('canvas')).toBeNull()

    element.remove()
  })
})
