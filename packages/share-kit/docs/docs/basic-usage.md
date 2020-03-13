---
id: basic-usage
title: Basic Usage
hide_title: true
---

# Usage

`renderRequestElement` will render a QR code or button based on the client's platform. By default it will render a button when the client is mobile or tablet and on iOS.

```typescript
import {renderRequestElement, RequestData, QROptions} from '@bloomprotocol/share-kit'

const requestData: RequestData = {
  version: 1,
  responseVersion: 1,
  action: 'credential'
  token: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000',
  url: 'https://mysite.com/api/share-kit/receive',
  payloadUrl: 'https://mysite.com/api/share-kit/payload/11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000',
}
const qrOptions: Partial<QROptions> = {
  size: 200,
}
const buttonOptions: ButtonOptions = {
  callbackUrl: 'https://mysite.com/api/share-kit/bloom-callback/11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000',
}

const container = document.createElement('div')

const {update, remove} = renderRequestElement({container, requestData, qrOptions, buttonOptions})

// Update the element
update({requestData: newRequestData, qrOptions: newQROptions, buttonOptions: newButtonOptions})

// Remove the element
remove()
```
