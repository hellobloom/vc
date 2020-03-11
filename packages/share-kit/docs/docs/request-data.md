---
id: request-data
title: Request Data
hide_title: true
---

# RequestData

Data to be rendered into the request element.

QR codes can only contain so much data so instead of providing all the data to Share Kit directly you provide a `payload_url` that returns the necessary information.

## Version 1

| Name        | Description                                                                                     | Type     |
| ----------- | ----------------------------------------------------------------------------------------------- | -------- |
| version     | The version of the request data structure                                                       | `1`      |
| token       | Unique string to identify this data request                                                     | `string` |
| url         | The API endpoint to POST the `ResponseData` to.<br/> See [below](#appending-to-url) for details | `string` |
| payload_url | The url the user's app will GET [`RequestPayloadDataV1`](request-payload-data) from             | `string` |

### Appending to URL

The user can share by tapping a button or scanning a QR code, sometimes you'll need to know the difference so the query param `share-kit-from` is appended to your url.

The param will either be `share-kit-from=qr` OR `share-kit-from=button`.

```diff
- 'https://mysite.com/api/share-kit/receive'
+ 'https://mysite.com/api/share-kit/receive?share-kit-from=qr'
```

Works if your url already has a query param too!

```diff
- 'https://mysite.com/api/share-kit/receive?my-param='
+ 'https://mysite.com/api/share-kit/receive?my-param=&share-kit-from=qr'
```
