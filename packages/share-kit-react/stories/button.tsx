import React, {useState} from 'react'
import {storiesOf} from '@storybook/react'

import {RequestElement, RequestElementProps, ButtonOptions, RequestData, ButtonSize, Action} from '../src'

const Updating: React.FC<Omit<RequestElementProps, 'buttonOptions'>> = props => {
  const [size, setSize] = useState<ButtonSize>('lg')

  let buttonOptions: ButtonOptions

  switch (size) {
    case 'sm':
      buttonOptions = {
        callbackUrl: 'https://mysite.com/bloom-callback',
        size,
        type: 'squircle',
      }
      break
    case 'md':
      buttonOptions = {
        callbackUrl: 'https://mysite.com/bloom-callback',
        size,
        type: 'log-in',
      }
      break
    case 'lg':
      buttonOptions = {
        callbackUrl: 'https://mysite.com/bloom-callback',
        size,
        type: 'connect',
      }
      break
    default:
      throw new Error('Unsupported type')
  }

  return (
    <React.Fragment>
      <RequestElement
        {...props}
        style={{width: buttonOptions.size === 'lg' || buttonOptions.size === undefined ? '335px' : undefined}}
        buttonOptions={buttonOptions}
      />
      <div style={{paddingTop: '8px'}}>
        <label>
          <input
            type="radio"
            name="size"
            value="sm"
            checked={size === 'sm'}
            onChange={() => {
              setSize('sm')
            }}
          />
          Small
        </label>
        <label>
          <input
            type="radio"
            name="size"
            value="md"
            checked={size === 'md'}
            onChange={() => {
              setSize('md')
            }}
          />
          Medium
        </label>
        <label>
          <input
            type="radio"
            name="size"
            value="lg"
            checked={size === 'lg'}
            onChange={() => {
              setSize('lg')
            }}
          />
          Large
        </label>
      </div>
    </React.Fragment>
  )
}

const baseButtonOptions: ButtonOptions = {
  callbackUrl: 'https://mysite.com/bloom-callback',
}
const allVersions: {label: string; requestData: RequestData}[] = [
  {
    label: 'V1',
    requestData: {
      version: 1,
      token: 'a08714b92346a1bba4262ed575d23de3ff3e6b5480ad0e1c82c011bab0411fdf',
      url: 'https://receive-kit.bloom.co/api/receive',
      payload_url: 'https://receive-kit.bloom.co/api/payload/a08714b92346a1bba4262ed575d23de3ff3e6b5480ad0e1c82c011bab0411fdf',
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
  storiesOf(`Button/${label}`, module)
    .add('Basic', () => (
      <RequestElement style={{width: '335px'}} shouldRenderButton requestData={requestData} buttonOptions={{...baseButtonOptions}} />
    ))
    .add('Updating', () => <Updating requestData={requestData} />)

  storiesOf(`Button/${label}/Large`, module)
    .add('Default', () => (
      <RequestElement style={{width: '335px'}} shouldRenderButton requestData={requestData} buttonOptions={{...baseButtonOptions}} />
    ))
    .add('Log In', () => (
      <RequestElement
        style={{width: '335px'}}
        shouldRenderButton
        requestData={requestData}
        buttonOptions={{...baseButtonOptions, type: 'log-in'}}
      />
    ))
    .add('Sign Up', () => (
      <RequestElement
        style={{width: '335px'}}
        shouldRenderButton
        requestData={requestData}
        buttonOptions={{...baseButtonOptions, type: 'sign-up'}}
      />
    ))
    .add('Connect', () => (
      <RequestElement
        style={{width: '335px'}}
        shouldRenderButton
        requestData={requestData}
        buttonOptions={{...baseButtonOptions, type: 'connect'}}
      />
    ))
    .add('Bloom', () => (
      <RequestElement
        style={{width: '335px'}}
        shouldRenderButton
        requestData={requestData}
        buttonOptions={{...baseButtonOptions, type: 'bloom'}}
      />
    ))

  storiesOf(`Button/${label}/Medium`, module)
    .add('Verify', () => <RequestElement shouldRenderButton requestData={requestData} buttonOptions={{...baseButtonOptions, size: 'md'}} />)
    .add('Log In', () => (
      <RequestElement shouldRenderButton requestData={requestData} buttonOptions={{...baseButtonOptions, size: 'md', type: 'log-in'}} />
    ))
    .add('Sign Up', () => (
      <RequestElement shouldRenderButton requestData={requestData} buttonOptions={{...baseButtonOptions, size: 'md', type: 'sign-up'}} />
    ))
    .add('Connect', () => (
      <RequestElement shouldRenderButton requestData={requestData} buttonOptions={{...baseButtonOptions, size: 'md', type: 'connect'}} />
    ))
    .add('Bloom', () => (
      <RequestElement shouldRenderButton requestData={requestData} buttonOptions={{...baseButtonOptions, size: 'md', type: 'bloom'}} />
    ))

  storiesOf(`Button/${label}/Small`, module)
    .add('Square', () => (
      <RequestElement shouldRenderButton requestData={requestData} buttonOptions={{...baseButtonOptions, size: 'sm', type: 'square'}} />
    ))
    .add('Rounded Square', () => (
      <RequestElement
        shouldRenderButton
        requestData={requestData}
        buttonOptions={{...baseButtonOptions, size: 'sm', type: 'rounded-square'}}
      />
    ))
    .add('Circle', () => (
      <RequestElement shouldRenderButton requestData={requestData} buttonOptions={{...baseButtonOptions, size: 'sm', type: 'circle'}} />
    ))
    .add('Squircle', () => (
      <RequestElement shouldRenderButton requestData={requestData} buttonOptions={{...baseButtonOptions, size: 'sm', type: 'squircle'}} />
    ))
    .add('Inverted', () => (
      <div style={{backgroundColor: '#6262F6', padding: '4px', display: 'inline-block'}}>
        <RequestElement
          shouldRenderButton
          requestData={requestData}
          buttonOptions={{...baseButtonOptions, size: 'sm', type: 'square', invert: true}}
        />
        <div style={{height: '4px'}} />
        <RequestElement
          shouldRenderButton
          requestData={requestData}
          buttonOptions={{...baseButtonOptions, size: 'sm', type: 'rounded-square', invert: true}}
        />
        <div style={{height: '4px'}} />
        <RequestElement
          shouldRenderButton
          requestData={requestData}
          buttonOptions={{...baseButtonOptions, size: 'sm', type: 'circle', invert: true}}
        />
        <div style={{height: '4px'}} />
        <RequestElement
          shouldRenderButton
          requestData={requestData}
          buttonOptions={{...baseButtonOptions, size: 'sm', type: 'squircle', invert: true}}
        />
      </div>
    ))
})
