import {renderClaimQRCode} from '../../src/elements/renderClaimQRCode'
import {ClaimData, ButtonOptions} from '../../src/types'
import {QROptions} from '../../src'

describe('renderClaimQRCode', () => {
  let claimQRCode: {
    update: (config: {claimData: ClaimData; buttonOptions: ButtonOptions; options?: Partial<QROptions>}) => void
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
    claimQRCode = renderClaimQRCode({
      container,
      claimData: {
        version: 1,
        url: 'https://claim-kit.bloom.co/api/claim',
        token: 'token',
      },
    })
  })

  afterEach(() => {
    claimQRCode.remove()
  })

  test('renders the qr code', () => {
    expect(container.innerHTML).toMatchSnapshot()
  })

  test('removes qr code', () => {
    claimQRCode.remove()

    expect(container.querySelector('canvas')).toBeNull()
  })
})
