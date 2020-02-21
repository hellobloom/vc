# Attestations ES

Attestation related kits for TS/JS

## Requesting Credentials

- Vanilla TS: [@bloomprotocol/share-kit](./packages/share-kit)
- React: [@bloomprotocol/share-kit-react](./packages/share-kit-react)
- React Native: [@bloomprotocol/share-kit-reactnative](./packages/share-kit-reactnative)

## Verifying Presentations and Credentials Data

- Node (TS): [@bloomprotocol/verify-kit](./packages/verify-kit)

## Claiming A Credential

- Vanilla TS: [@bloomprotocol/claim-kit](./packages/claim-kit)
- React: [@bloomprotocol/claim-kit-react](./packages/claim-kit-react)

## Issuing A Credential

- Node (TS): [@bloomprotocol/issue-kit](./packages/issue-kit)

## Common Types and Logic

- TS: [@bloomprotocol/attestations-common](./packages/attestations-common)

## Adding a new package

Most packages should use [tsdx](https://github.com/jaredpalmer/tsdx).

```bash
cd path/to/attestations-es/packages
npx tsdx create mylib
cd mylib
```

To add other packages as dependencies you should manually add them to the package.json and run `lerna bootstrap`. If you already have all the packages built, through a previous `lerna boostrap`, you can skip the building step by running `lerna boostrap --ignore-scripts`
