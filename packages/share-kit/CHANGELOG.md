## 7.6.1

**Bug fixes**:

- Include tslib in dependencies

**Miscellaneous**:

- Bump to latest `@bloomprotocol/qr`

## 7.6.0

**Improvements**

- Use the `@bloomprotocol/qr` package to render the QR code
- Use the `@bloomprotocol/attestations-common` for shared types

## 7.3.0

**Miscellaneous**:

- Add `onclick` handler to QR element to copy the request data as JSON to the clipboard.

## 7.2.2

**Bug fixes**:

- Append the `share-kit-from` query parameter within `renderRequestButton` and `renderRequestQRCode` so it's appended when updating the request element.

## 7.2.1

**Bug fixes**:

- Replace `append-query` dependency with internal function
  - Fixes `npm audit` warning

## 7.2.0

**Improvements**

- Update the `verify` button's text to "Verify with Bloom" instead of "Verify with BloomID"

## 7.1.0

**New Features**:

- Button variations are now available!
  - This includes three sizes: small, medium, and large
    - Large is what was being rendered before
  - And style/content variations for each size
    - Small: square, rounded square, circle, squircle
      - Small buttons can also have their foreground and background colors switched with the `inverted` field
    - Medium: log in, sign up, connect, bloom, and verify
    - Large: log in, sign up, connect, bloom, and verify

## 7.0.0

**Improvements**

- Use [tsdx](https://github.com/palmerhq/tsdx) to build

**Breaking**

- This package no longer provides validation utils, instead use [verify-kit](https://github.com/hellobloom/verify-kit)
- Remove `buttonCallbackUrl` in favor of `buttonOptions`
  - This will be expanded to include options for button type (signin/signup/verify/etc.) among other things

## 5.0.1

**Improvements**

- Improve how padding is calculated and displayed

## 5.0.0

**Breaking**

- Render "Verify with Bloom" button for clients on Android devices

## 4.0.1

**Improvements**:

- Bump to web3x@3.0.0
  - This removed

## 4.0.0

**New Features**:

- `renderRequestElement`: Renderer that dynamically renders a "Tap To Share" button or QR code based on the client's user agent.
  - On mobile it will render a button that opens the Bloom app
  - On desktop it will render a QR code that the user will scan with the Bloom app

**Breaking**:

- This release removes all depecreated functions and the react dependency. There will be a `share-kit-react` library coming soon!

- `generateRequestQRCOde`, `manageRequestQRCode`, and `RequestQRCode` are removed
  - Replacements:
    - `generateRequestQRCOde` => `renderRequestElement`
    - `manageRequestQRCode` => `renderRequestElement`
    - `RequestQRCode` => `RequestElement` (from share-kit-react coming soon!!)

## 2.2.0

**Improvements**:

- Improve "eye" rendering

## 2.1.1 (HOTFIX)

**Improvements**:

- Fix default width calculation of logo image

## 2.1.0

**New Features**:

- Implement a QR code with circles and rounded "eyes" instead of squares
- Add `generateRequestQRCode`
  - This takes a `canvas` element as well as the request data and options for the QR code.

**Improvements**:

- Change the default EC level of the QR code to `L`
- Change image URLs in README so they show up on npm
- Make it so the logo doesn't half-cover any data bits
- Change the logo background from a rounded rectangle to a regular rectangle

**Deprecations**:

- `createRequestQRCode`, `updateRequestQRCode`, and `removeRequestQRCode`
  - If using React use `RequestQRCode`, otherwise use `generateRequestQRCode`

## 2.0.3

**Bug fixes**:

- Fix npm package
  - Use package.json#files to include only the files we need in the package

## 2.0.2

**Bug fixes**:

- Fix npm package including the `.git` directory
  - Now using `yarn publish` with yarn 1.12.1 since it supports 2fa

## 2.0.1

**Bug fixes**:

- Fix rendering issue in Firefox

## 2.0.0

**BREAKING**:

- Removed the `renderAs` prop, the QR will always render with canvas now

**New Features**:

- Add a image overlay to the QR code, can be turned off with the `hideLogo` prop

## 1.1.1

**Bug fixes**:

- Fix types

## 1.1.0

**New Features**:

- Add verification utils

## 1.0.0

- Initial release
