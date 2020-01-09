## 2.0.0

**Improvements**

- By making the public API smaller it is now easier to know how to use this library
- `validateVerifiablePresentationResponse` now returns "invalid" if any of the onchain validations comes back invalid

**Breaking**

- Most functions have been removed from the public API. The two main entry points are now `validateVerifiablePresentationResponse` and `validateVerifiableAuthResponse`
- All `type`s have been removed from this library, they are exported by [attestations-common](https://github.com/hellobloom/attestations-ts/tree/master/packages/attestations-common) now.

## 1.0.0

- Initial release
