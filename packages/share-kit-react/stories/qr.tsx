import React, {useState} from 'react'
import {storiesOf} from '@storybook/react'

import {RequestElement, RequestElementProps, RequestData, Action} from '../src'

const Updating: React.FC<RequestElementProps> = props => {
  const [count, setCount] = useState(0)

  return (
    <React.Fragment>
      <RequestElement
        {...props}
        requestData={{
          ...props.requestData,
          token: `${props.requestData.token} ${count}`,
        }}
      />
      <button onClick={() => setCount(count + 1)}>Update QR Code</button>
    </React.Fragment>
  )
}

const Logo: React.FC<RequestElementProps> = props => {
  const [logoHidden, setLogoHidden] = useState(false)

  return (
    <React.Fragment>
      <RequestElement
        {...props}
        qrOptions={{
          ...props.qrOptions,
          hideLogo: logoHidden,
        }}
      />
      <button onClick={() => setLogoHidden(!logoHidden)}>{logoHidden ? 'Show' : 'Hide'} Logo</button>
    </React.Fragment>
  )
}

const allVersions: {label: string; requestData: RequestData}[] = [
  {
    label: 'V1',
    requestData: {
      version: 1,
      responseVersion: 1,
      action: 'credential',
      token: 'a08714b92346a1bba4262ed575d23de3ff3e6b5480ad0e1c82c011bab0411fdf',
      url: 'https://receive-kit.bloom.co/api/receive',
      payloadUrl: 'https://receive-kit.bloom.co/api/payload/a08714b92346a1bba4262ed575d23de3ff3e6b5480ad0e1c82c011bab0411fdf',
    },
  },
  {
    label: 'Legacy',
    requestData: {
      action: Action.attestation,
      token: 'a08714b92346a1bba4262ed575d23de3ff3e6b5480ad0e1c82c011bab0411fdf',
      url: 'https://receive-kit.bloom.co/api/receive',
      org_logo_url: 'https://bloom.co/images/notif/bloom-logo.png',
      org_name: 'Bloom',
      org_usage_policy_url: 'https://bloom.co/legal/terms',
      org_privacy_policy_url: 'https://bloom.co/legal/privacy',
      types: ['phone', 'email'],
    },
  },
]

allVersions.forEach(({label, requestData}) => {
  storiesOf(`QR/${label}`, module)
    .add('Basic', () => (
      <RequestElement
        shouldRenderButton={false}
        requestData={requestData}
        buttonOptions={{callbackUrl: 'https://mysite.com/bloom-callback'}}
      />
    ))
    .add('Colors', () => (
      <RequestElement
        shouldRenderButton={false}
        requestData={requestData}
        qrOptions={{
          bgColor: '#EBF0F1',
          fgColor: '#3C3C3D',
        }}
        buttonOptions={{callbackUrl: 'https://mysite.com/bloom-callback'}}
      />
    ))
    .add('Logo', () => (
      <Logo shouldRenderButton={false} requestData={requestData} buttonOptions={{callbackUrl: 'https://mysite.com/bloom-callback'}} />
    ))
    .add('Size', () => (
      <RequestElement
        shouldRenderButton={false}
        requestData={requestData}
        qrOptions={{size: 300}}
        buttonOptions={{callbackUrl: 'https://mysite.com/bloom-callback'}}
      />
    ))
    .add('Updating', () => (
      <Updating shouldRenderButton={false} requestData={requestData} buttonOptions={{callbackUrl: 'https://mysite.com/bloom-callback'}} />
    ))
    .add('Padding', () => (
      <RequestElement
        shouldRenderButton={false}
        requestData={requestData}
        qrOptions={{padding: 10, bgColor: '#EBF0F1', fgColor: '#3C3C3D'}}
        buttonOptions={{callbackUrl: 'https://mysite.com/bloom-callback'}}
      />
    ))
})
