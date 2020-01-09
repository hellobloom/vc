import React from 'react'
import {storiesOf} from '@storybook/react-native'
import {RequestButton, Action} from '../../dist'

// eslint-disable-next-line import/extensions
import CenterView from './CenterView'

const requestData = {
  action: Action.attestation,
  token: 'a08714b92346a1bba4262ed575d23de3ff3e6b5480ad0e1c82c011bab0411fdf',
  url: 'https://receive-kit.bloom.co/api/receive',
  org_logo_url: 'https://bloom.co/images/notif/bloom-logo.png',
  org_name: 'Bloom',
  org_usage_policy_url: 'https://bloom.co/legal/terms',
  org_privacy_policy_url: 'https://bloom.co/legal/privacy',
  types: ['phone', 'email'],
}
const buttonCallbackUrl = 'https://mysite.com/bloom-callback'

storiesOf('RequestButton', module)
  .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
  .add('Large/Verify', () => <RequestButton requestData={requestData} callbackUrl={buttonCallbackUrl} />)
  .add('Large/Log In', () => <RequestButton requestData={requestData} callbackUrl={buttonCallbackUrl} size="lg" type="log-in" />)
  .add('Large/Sign Up', () => <RequestButton requestData={requestData} callbackUrl={buttonCallbackUrl} size="lg" type="sign-up" />)
  .add('Large/Connect', () => <RequestButton requestData={requestData} callbackUrl={buttonCallbackUrl} size="lg" type="connect" />)
  .add('Large/Bloom', () => <RequestButton requestData={requestData} callbackUrl={buttonCallbackUrl} size="lg" type="bloom" />)
  .add('Medium/Verify', () => <RequestButton requestData={requestData} callbackUrl={buttonCallbackUrl} size="md" />)
  .add('Medium/Log In', () => <RequestButton requestData={requestData} callbackUrl={buttonCallbackUrl} size="md" type="log-in" />)
  .add('Medium/Sign Up', () => <RequestButton requestData={requestData} callbackUrl={buttonCallbackUrl} size="md" type="sign-up" />)
  .add('Medium/Connect', () => <RequestButton requestData={requestData} callbackUrl={buttonCallbackUrl} size="md" type="connect" />)
  .add('Medium/Bloom', () => <RequestButton requestData={requestData} callbackUrl={buttonCallbackUrl} size="md" type="bloom" />)
  .add('Small/Circle', () => <RequestButton requestData={requestData} callbackUrl={buttonCallbackUrl} size="sm" type="circle" />)
  .add('Small/Squircle', () => <RequestButton requestData={requestData} callbackUrl={buttonCallbackUrl} size="sm" type="squircle" />)
  .add('Small/Square', () => <RequestButton requestData={requestData} callbackUrl={buttonCallbackUrl} size="sm" type="square" />)
  .add('Small/Rounded Square', () => (
    <RequestButton requestData={requestData} callbackUrl={buttonCallbackUrl} size="sm" type="rounded-square" />
  ))
  .add('Small/Inverted', () => (
    <React.Fragment>
      <RequestButton requestData={requestData} callbackUrl={buttonCallbackUrl} size="sm" invert type="circle" />
      <RequestButton requestData={requestData} callbackUrl={buttonCallbackUrl} size="sm" invert type="squircle" />
      <RequestButton requestData={requestData} callbackUrl={buttonCallbackUrl} size="sm" invert type="rounded-square" />
      <RequestButton requestData={requestData} callbackUrl={buttonCallbackUrl} size="sm" invert type="square" />
    </React.Fragment>
  ))
