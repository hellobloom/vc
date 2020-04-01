---
id: getting-started
title: Getting Started | Implementation Guidelines
sidebar_label: Getting Started
hide_title: true
---

![Implementation Guidelines](link to image)

# Implementation Guildelines

The recommended implementaion guidelines for the Bloom Identity clients. Learn how to build a client that can claim, store, and share Verifiable Credentials.

## Client Overview

A Bloom client has the following capabilities:

- Local DID generation and registration
- Verifiable Credential claiming
- Verifiable Credential encryption, storage, and indexing
- Verifiable Credential sharing

## Ecosystem Overview

A Bloom client interacts with the following external services:

| Service        | Description                                    | Link |
| -------------- | ---------------------------------------------- | ---- |
| Issuer Service | Presents VCs for the client to claim           |      |
| Share Kit      | Requests VCs from client                       |      |
| Verify Kit     | Validates shared VCs                           |      |
| Bloom Vault    | Stores encrypted VCs and metadata for indexing |      |

In addition, Bloom clients interact with application logic that surrounds the core identity functionality. Application logic is out of scope for these implementation guidelines.
