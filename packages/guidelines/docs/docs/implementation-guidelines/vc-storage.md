---
id: vc-storage
title: Verifiable Credential Storage | Implementation Guidelines
sidebar_label: Verifiable Credential Storage
hide_title: true
---

# Verifiable Credential Storage

Bloom has developed an Encrypted Data Vault for storing user data. The vault uses DID based authentication to insert, query, and remove data for the user. The data is encrypted at rest by a key that is stored on the client.

## VC Storage Overview

The client has the following capabilities related to VC storage:

- Encryption of VC data
- Authentication methods to register and access vault
- Local indexing system to understand what data is stored in vault

### Encryption

The Bloom client reference implementation uses local AES encryption to encrypt VC data before storing in vault. Any metadata is also encrypted and stored in the vauld encrypted indices column for easy querying.

### Vault methods

The client implements api abstractions for authentication and data manipulation.

### Indexing

Bloom recommends the following implementation to keep track of data in the vault and satisfy VC sharing lookups.
