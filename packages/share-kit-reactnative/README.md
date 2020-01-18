![Share Kit React Native](https://github.com/hellobloom/attestations-es/raw/master/assets/share-kit/logo.png)

# Share Kit React Native

React Native wrapper for [Share Kit](https://github.com/hellobloom/attestations-es/tree/master/packages/share-kit#readme)

- [Share Kit React Native](#share-kit-react-native)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Storybook Demo](#storybook-demo)

## Installation

```
npm install --save @bloomprotocol/share-kit-reactnative
```

You may need to also link these dependencies

```
react-native link react-native-svg
react-native link react-native-linear-gradient
```

## Usage

`RequestButton` will render a button that opens the Bloom app to share specified data.

```tsx
import React from 'react'
import {RequestButton, Action, RequestData} from '@bloomprotocol/share-kit-reactnative'

const requestData: RequestData = {...}

const buttonCallbackUrl = 'https://mysite.com/bloom-callback'
<RequestButton
  requestData={requestData}
  callbackUrl={callbackUrl}
  size="lg"
  type="log-in"
/>
```

## More

For more information and documentation see [Share Kit](https://github.com/hellobloom/attestations-es/tree/master/packages/share-kit#readme)

## Storyboard Demo

### Build Libary

1. Build the library

```
npm run build
```

2. Run the storybook

```
cd example
```

- On android

```
react-native run-andoird
```

- On ios

```
react-native run-ios
```
