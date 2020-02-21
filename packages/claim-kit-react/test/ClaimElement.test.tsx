import * as React from 'react'
import {render, cleanup} from '@testing-library/react'
import {QROptions} from '@bloomprotocol/claim-kit'

import {ClaimElement} from '../src/ClaimElement'
import {ClaimData} from '../src'

const claimData: ClaimData = {
  version: 1,
  url: 'https://claim-kit.bloom.co/api/claim',
  token: 'token',
}
const claimData2: ClaimData = {
  version: 1,
  url: 'https://claim-kit.bloom.co/api/claim',
  token: 'token 2',
}

const buttonCallbackUrl = 'https://mysite.com/bloom-callback'
const buttonCallbackUrl2 = 'https://mysite.com/bloom-callback-2'

const qrOptions: Partial<QROptions> = {size: 300}

describe('ClaimElement', () => {
  afterEach(cleanup)

  test('renders correctly', () => {
    const result = render(
      <ClaimElement claimData={claimData} buttonOptions={{callbackUrl: buttonCallbackUrl}} qrOptions={qrOptions} shouldRenderButton />,
    )

    const search = result.container.querySelector('a')!.href.replace('https://bloom.co/download', '')
    const urlParams = new URLSearchParams(search)

    const claimQuery = urlParams.get('claim')
    const callbackUrlParam = urlParams.get('callback-url')

    if (typeof claimQuery !== 'string' || typeof callbackUrlParam !== 'string') {
      if (typeof claimQuery !== 'string') {
        fail(`claimQuery is not set: ${urlParams}`)
      }

      if (typeof callbackUrlParam !== 'string') {
        fail('callbackUrlParam is not set')
      }
    } else {
      expect(JSON.parse(window.atob(claimQuery))).toMatchSnapshot()
      expect(callbackUrlParam).toMatchSnapshot()
    }
  })

  describe('updates when', () => {
    test('claimData changes', () => {
      const result = render(
        <ClaimElement claimData={claimData} buttonOptions={{callbackUrl: buttonCallbackUrl}} qrOptions={qrOptions} shouldRenderButton />,
      )

      const search = result.container.querySelector('a')!.href.replace('https://bloom.co/download', '')
      const urlParams = new URLSearchParams(search)

      const claimQuery = urlParams.get('claim')
      const callbackUrlParam = urlParams.get('callback-url')

      if (typeof claimQuery !== 'string' || typeof callbackUrlParam !== 'string') {
        if (typeof claimQuery !== 'string') {
          fail(`claimQuery is not set: ${urlParams}`)
        }

        if (typeof callbackUrlParam !== 'string') {
          fail('callbackUrlParam is not set')
        }
      } else {
        expect(JSON.parse(window.atob(claimQuery))).toMatchSnapshot()
        expect(callbackUrlParam).toMatchSnapshot()

        result.rerender(
          <ClaimElement claimData={claimData2} buttonOptions={{callbackUrl: buttonCallbackUrl}} qrOptions={qrOptions} shouldRenderButton />,
        )

        const search2 = result.container.querySelector('a')!.href.replace('https://bloom.co/download', '')
        const urlParams2 = new URLSearchParams(search2)

        const claimQuery2 = urlParams2.get('claim')
        const callbackUrlParam2 = urlParams2.get('callback-url')

        if (typeof claimQuery2 !== 'string' || typeof callbackUrlParam2 !== 'string') {
          if (typeof claimQuery2 !== 'string') {
            fail('claimQuery is not set')
          }

          if (typeof callbackUrlParam2 !== 'string') {
            fail('callbackUrlParam is not set')
          }
        } else {
          expect(JSON.parse(window.atob(claimQuery2))).toMatchSnapshot()
          expect(callbackUrlParam2).toMatchSnapshot()
        }
      }
    })

    test('buttonCallbackUrl changes', () => {
      const result = render(
        <ClaimElement claimData={claimData} buttonOptions={{callbackUrl: buttonCallbackUrl}} qrOptions={qrOptions} shouldRenderButton />,
      )

      const search = result.container.querySelector('a')!.href.replace('https://bloom.co/download', '')
      const urlParams = new URLSearchParams(search)

      const claimQuery = urlParams.get('claim')
      const callbackUrlParam = urlParams.get('callback-url')

      if (typeof claimQuery !== 'string' || typeof callbackUrlParam !== 'string') {
        if (typeof claimQuery !== 'string') {
          fail('claimQuery is not set')
        }

        if (typeof callbackUrlParam !== 'string') {
          fail('callbackUrlParam is not set')
        }
      } else {
        expect(JSON.parse(window.atob(claimQuery))).toMatchSnapshot()
        expect(callbackUrlParam).toMatchSnapshot()

        result.rerender(
          <ClaimElement claimData={claimData} buttonOptions={{callbackUrl: buttonCallbackUrl2}} qrOptions={qrOptions} shouldRenderButton />,
        )

        const search2 = result.container.querySelector('a')!.href.replace('https://bloom.co/download', '')
        const urlParams2 = new URLSearchParams(search2)

        const claimQuery2 = urlParams2.get('claim')
        const callbackUrlParam2 = urlParams2.get('callback-url')

        if (typeof claimQuery2 !== 'string' || typeof callbackUrlParam2 !== 'string') {
          if (typeof claimQuery2 !== 'string') {
            fail('claimQuery is not set')
          }

          if (typeof callbackUrlParam2 !== 'string') {
            fail('callbackUrlParam is not set')
          }
        } else {
          expect(JSON.parse(window.atob(claimQuery2))).toMatchSnapshot()
          expect(callbackUrlParam2).toMatchSnapshot()
        }
      }
    })
  })
})
