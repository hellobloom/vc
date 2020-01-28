## 4.5.2

**Improvements**

- Bump to latest [share-kit](https://github.com/hellobloom/attestations-es/tree/master/packages/share-kit)

## 4.5.1

**Bug fixes**:

- Include tslib in dependencies

**Miscellaneous**:

- Bump to latest `@bloomprotocol/qr`

## 4.5.0

**Improvements**

- Bump to latest [share-kit](https://github.com/hellobloom/attestations-es/tree/master/packages/share-kit)

## 4.3.0

**Miscellaneous**

- Consumes 7.3.0 share-kit package that adds an `onclick` handler to QR element to copy the request data as JSON to the clipboard.

## 4.2.2

**Improvements**

- Bump to latest [share-kit](https://github.com/hellobloom/attestations-es/tree/master/packages/share-kit) to fix appending to `requestData.url`

## 4.2.1

**Bug Fixes**

- Fix uploaded dist

## 4.2.0

**Improvements**

- Bump to latest [share-kit](https://github.com/hellobloom/attestations-es/tree/master/packages/share-kit) to include updated text for `verify` buttons

## 4.1.0

**Improvements**

- Bump to latest [share-kit](https://github.com/hellobloom/attestations-es/tree/master/packages/share-kit) to include button variations
- Add `React.HTMLAttributes<HTMLDivElement>` to `RequestElementProps` to support passing extra DOM props

**Misc**

- Update dev dependencies

## 4.0.0

**Improvements**

- Use [tsdx](https://github.com/palmerhq/tsdx) to build
- Expand support of react to "^15.0.0 || ^16.0.0"

**Breaking**

- This package no longer provides validation utils, instead use [verify-kit](https://github.com/hellobloom/verify-kit)
- Remove `RequestElementProps.buttonCallbackUrl` in favor of `RequestElementProps.buttonOptions`
  - This will be expanded to include options for button type (signin/signup/verify/etc.) among other things
- React is now a peer dependency, you will need to specify react as a dependency in your `package.json` moving forward

## 2.0.0

**Breaking**

- Pull in latest share-kit to render "Verify with Bloom" button for clients on Android devices

## 1.0.1

**Improvements**:

- Bump to @bloomprotocol/share-kit@4.0.1

## 1.0.0

- Initial release
