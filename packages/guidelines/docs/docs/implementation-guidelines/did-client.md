---
id: did-client
title: DID Client | Implementation Guidelines
sidebar_label: DID Client
hide_title: true
---

# DID Client

Bloom complies to the emerging DID, or Decentralized Identifier, specification. While universal resolvers have been built to resolve a wide range of DIDs, Bloom currently focuses on supporting Ethereum key based DIDs. Specifically the Bloom client reference implementation uses DID:Elem, an Ethereum Sidetree implementation. (TODO links)

## DID Client Overview

The DID client has the following capabilities:

- Key Generation
- DID Registration
- Message Signing

### Key Generation

TODO RNG, etc...

### DID Registration

Depending on the DID method, a DID must be anchored for it to be resolved by another party.
For now, application logic is handling DID anchoring for Bloom DID:Elem
TODO - what does client have to do here?
At some point DID client will also have to be able to register, revoke, rotate other keys.

### Message Signing

The DID must be able to sign arbitrary messages with the DID private key. The message formatting prior to signing complies with standard JSON-LD signatures.
TODO expand
