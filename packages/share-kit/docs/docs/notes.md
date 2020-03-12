---
id: notes
title: Notes
hide_title: true
---

# Notes

## Provider vs Issuer

A provider is the party who supplies the data to be verified and an issuer is the party that signs the data gotten from the provider. Sometimes the provider can be the same as the issuer.

In the options above the provider will be the _name_ of the data provider while the issuer will the be eth address of the signer.

## Server Side Checks

The filtering options above (`completed_(after|before)`, `(provider|issuer)_(black|white)list`) are meant to improve user expience when sharing attestations. When users attempt to share attestations from their mobile app they will be restricited by the provided filters. But due to the nature of how they share data directly to your server people can share data outside of the app.

This means that the completed data, provider, and issuer still need to be verified on your backend after receiving the data. You can do this while you are validating the overall structure and proofs with [Verify Kit](https://github.com/hellobloom/vc).
