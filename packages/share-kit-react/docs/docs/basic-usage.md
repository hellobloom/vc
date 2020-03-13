---
id: basic-usage
title: Basic Usage
hide_title: true
---

# Usage

`RequestElement` will render a QR code or button based on the client's platform. By defualt it will render a button when the client is mobile or tablet and on iOS.

```tsx
import React from 'react'
import {RequestElement, RequestData, QROptions, ButtonOptions} from '@bloomprotocol/share-kit-react'

const requestData: RequestData = {...}
const buttonOptions: ButtonOptions = {
  callbackUrl: 'https://mysite.com/bloom-callback',
}

<RequestElement
  requestData={requestData}
  buttonOptions={buttonOptions}
/>

// Setting QR Options

const qrOptions: Partial<QROptions> = {
  size: 200,
}

<RequestElement
  requestData={requestData}
  buttonOptions={buttonOptions}
  qrOptions={qrOptions}
/>

// Overriding shouldRenderButton
<RequestElement
  requestData={requestData}
  buttonOptions={buttonOptions}
  shouldRenderButton={(parsedResult) => {
    if (parsedResult.platform.type === 'mobile') return true

    return false
  }}
/>

// Always render a button
<RequestElement
  requestData={requestData}
  buttonOptions={buttonOptions}
  shouldRenderButton
/>

// Passing props to the container
<RequestElement
  requestData={requestData}
  buttonOptions={buttonOptions}
  className="request-element-container"
/>
```
