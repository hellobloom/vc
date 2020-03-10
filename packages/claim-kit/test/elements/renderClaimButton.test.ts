import {renderClaimButton} from '../../src/elements/renderClaimButton'
import {ButtonOptions, ClaimData} from '../../src/types'

describe('renderClaimButton', () => {
  let claimButton: {
    update: (config: {claimData: ClaimData; buttonOptions: ButtonOptions}) => void
    remove: () => void
  }
  let container: HTMLDivElement

  beforeAll(() => {
    container = document.createElement('div')
  })

  afterAll(() => {
    container.remove()
  })

  beforeEach(() => {
    claimButton = renderClaimButton({
      container,
      claimData: {
        version: 1,
        url: 'https://claim-kit.bloom.co/api/claim',
        token: 'token',
      },
      buttonOptions: {
        callbackUrl: 'https://bloom.co/callback-url',
      },
      id: 'bloom-claim-element-',
    })
  })

  afterEach(() => {
    claimButton.remove()
  })

  test('renders a button', () => {
    expect(container.innerHTML).toMatchSnapshot()

    const search = container.querySelector('a')!.href.replace('https://bloom.co/download', '')
    const urlParams = new URLSearchParams(search)

    const claimQuery = urlParams.get('claim')!
    const callbackUrlQuery = urlParams.get('callback-url')!

    expect(JSON.parse(window.atob(claimQuery))).toMatchSnapshot()
    expect(callbackUrlQuery).toMatchSnapshot()
  })

  test('renders a medium button', () => {
    claimButton.update({
      claimData: {
        version: 1,
        url: 'https://claim-kit.bloom.co/api/claim',
        token: 'token',
      },
      buttonOptions: {
        callbackUrl: 'https://bloom.co/callback-url',
        size: 'md',
      },
    })

    expect(container.innerHTML).toMatchSnapshot()
  })

  test('renders a small button', () => {
    claimButton.update({
      claimData: {
        version: 1,
        url: 'https://claim-kit.bloom.co/api/claim',
        token: 'token',
      },
      buttonOptions: {
        callbackUrl: 'https://bloom.co/callback-url',
        size: 'sm',
        type: 'square',
      },
    })

    expect(container.innerHTML).toMatchSnapshot()
  })

  test('updates the button', () => {
    claimButton.update({
      claimData: {
        version: 1,
        url: 'https://claim-kit.bloom.co/api/claim',
        token: 'token 2',
      },
      buttonOptions: {
        callbackUrl: 'https://bloom.co/callback-url-2',
      },
    })

    const search = container.querySelector('a')!.href.replace('https://bloom.co/download', '')
    const urlParams = new URLSearchParams(search)

    const claimQuery = urlParams.get('claim')!
    const callbackUrlQuery = urlParams.get('callback-url')!

    expect(JSON.parse(window.atob(claimQuery))).toMatchSnapshot()
    expect(callbackUrlQuery).toMatchSnapshot()
  })

  test('removes the button', () => {
    claimButton.remove()

    expect(container.querySelector('a')).toBeNull()
  })
})
