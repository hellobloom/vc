# Verify Kit

Easily verify BloomID data your users shared with your application.

- [Verify Kit](#verify-kit)
  - [Installation](#installation)
  - [Usage](#usage)
    - [ResponseData](#responsedata)
      - [Example](#data-example)
    - [Example](#example)
- [Using Verify Kit for BloomID Sign-In](#using-verify-kit-for-bloomid-sign-in)

## Installation

```
npm install --save @bloomprotocol/verify-kit
```

## Usage

When the user allows access you get a response back.

### ResponseData

The payload is formatted as specified by Bloom's interpretation of the [W3C Verifiable Presentation Data Model](https://w3c.github.io/vc-data-model/#presentations-0). The payload differs depending on whether or not the verification is for purposes of sharing Verifiable Credential(s), or Verifiable Authentication.

Format of the HTTP POST request (Verifiable Credential):

| Name                 | Description                                                                    | Type                       |
| -------------------- | ------------------------------------------------------------------------------ | -------------------------- |
| context              | URLs linking to machine readable documents describing how to interpet the data | \`string[]\`               |
| type                 | Standard type string specifying the document ('VerifiablePresentation')        | \`string\`                 |
| verifiableCredential | Array of credentials being presented in this document                          | \`VerifiableCredential[]\` |
| proof                | Presentation proof showing the sender's authority over the shared data         | \`PresentationProof\`      |
| packedData           | Hex string representation of the hashed proof                                  | \`string\`                 |
| signature            | Signature of \`packedData\` by the user with their mnemonic.                   | \`string\`                 |
| token                | Unique string to identify this data request                                    | \`string\`                 |

Format of the HTTP POST request (Verifiable Authentication):

| Name      | Description                                                                    | Type                    |
| --------- | ------------------------------------------------------------------------------ | ----------------------- |
| context   | URLs linking to machine readable documents describing how to interpet the data | \`string[]\`            |
| type      | Standard type string specifying the document ('VerifiableAuth')                | \`string\`              |
| proof     | Presentation proof showing the sender's authority over the shared data         | \`AuthenticationProof\` |
| signature | Signature of \`packedData\` by the user with their mnemonic.                   | \`string\`              |

<h4 id="example-data">Example</h4>

```json
{
  "signature": "0x1b6dfeb3608e5793bf7cfdbeedbb84bd06bc769f9c4450e1253e424b69bc451679007ddcab8a85bf6562c8551e99a3a07159c1dcbe1dd866e889e524846241e71c",
  "type": "VerifiablePresentation",
  "token": "78c7f905-6091-4c7f-a63f-f8590242502f",
  "verifiableCredential": [
    {
      "credentialSubject": {
        "subject": "0x1cc73a01dab0d88060d86033d21c9068e601b84c",
        "data": "ipatka@gmail.com",
        "authorization": []
      },
      "id": "placeholder",
      "proof": {
        "created": "2019-05-15T01:38:02.502Z",
        "data": {
          "subject": "0x1cc73a01dab0d88060d86033d21c9068e601b84c",
          "version": "batch",
          "batchAttesterSig": "0xffcf3b824f4beffa50c250308f54f6367444d86af8196ca452c71a7eefceec473baf33b4d87279ea527222eb7b055fc7b9c93846d78593fbaa2852009e92e1351c",
          "rootHashNonce": "0xd19abeca6dd0e7daa486d9e596d9dca96728c568751918dc99e1aaca3ab445be",
          "layer2Hash": "0x36e952d746dbaa6c8b3e2451145198de8945094db39f52a4c9497d61241dea16",
          "rootHash": "0x2223208a5a1927fed62f95c1be879b1831b556300a87ba41fa931f0968ad7f23",
          "stage": "mainnet",
          "proof": [
            {
              "position": "left",
              "data": "0x7079ce5b946f0fbc0b160c8aee7a7db02c92f5f6a9cb42408cd60adc72a17823"
            },
            {
              "position": "left",
              "data": "0x8fc45a1e10df267e5e127286b9913fdb22fe27cd99196491f9aa9af80f5ca342"
            },
            {
              "position": "right",
              "data": "0x3e2466500850683f4c32605fb9fca000e44c463fc4b9557cbfba0ce54589d8a7"
            },
            {
              "position": "left",
              "data": "0xa2920d7b3306ae8397715ff574ce183a7678a5ffa58648ab088766a279c310d5"
            }
          ],
          "requestNonce": "0xc995c3badcbb87a59bade5559e43630a07fb793c2ae4808fbc81263360008607",
          "target": {
            "claimNode": {
              "data": {
                "nonce": "a92c0e08bd7ade12c92424c7d4861236c26b831c1423f3ab54e4bb5b51df6679",
                "data": "ipatka@gmail.com",
                "version": "2.0.0"
              },
              "issuance": {
                "typeHash": "0x2b8f752a33ec25cd6aef2cb067477b64a4fe727238f4a31807ff4c2ec45c6a0b",
                "expirationDate": "2024-05-15T01:38:02.502Z",
                "dataHash": "0xecde0370b2a4cacefbbc13c0a63d451857be256ca69150bb960b48822522c8d6",
                "localRevocationToken": "0xe84ab3e2c99464702260749716d65b9b184c8ddf14d1db0f3a7a111164d1f2b2",
                "issuanceDate": "2019-05-15T01:38:02.502Z",
                "globalRevocationToken": "0xddd4dd3dd27861da7627fa4d48916fb4a681498ff6914ddfa815c5d6eba2fab1"
              },
              "aux": "0x2d42ba0a6212914179d480f3b4c35238da98f9af75b117986d58252c21388fc8",
              "type": {
                "type": "email",
                "nonce": "ebb6668e467df4f591647dd5b5b7c7dc1b7ca06f6f52f705ea4e1fb5c784e00b",
                "provider": "Bloom"
              }
            },
            "attesterSig": "0xad9ba60d018bbc1a9b2ad69f9f415779394b69e89284348f681a7d181ec95bd05230b793ca1286f6d960fec9a117d8d6860e87df8054c1baf4d76f589baf95661b",
            "attester": "0x156ba3f2af07d24cfd5dd8ec0fe2b17c6131d7fb"
          },
          "subjectSig": "0x3c142cf48a169616cc3c1665df1721f1fee3d4f96f9936e82ee39f01946b082461ccfe71e86912deb3c9343ae60ddda59b1b5f5a2a889109a507422ca036a3931b",
          "attester": "0x156ba3f2af07d24cfd5dd8ec0fe2b17c6131d7fb",
          "batchLayer2Hash": "0x01f575b3beb4ac1706494c756fb19632a2fa494bd6c171522132ba4f3b48770f"
        },
        "type": "Bloom-Batch-Proof-1.0.0",
        "creator": "0x156ba3f2af07d24cfd5dd8ec0fe2b17c6131d7fb"
      },
      "type": "email",
      "issuer": "0x156ba3f2af07d24cfd5dd8ec0fe2b17c6131d7fb",
      "issuanceDate": "2019-05-15T01:38:02.502Z"
    }
  ],
  "packedData": "0xae69844748a07e06d259aa697a3e1867bd84749a53bded6d4a4cf9cc7b97bbab",
  "context": ["placeholder"],
  "proof": {
    "credentialHash": "0x0d0f48792f41e35fd83f70c2ac5694eaf08291cdd7530a331715db34a688409e",
    "created": "2019-05-15T23:53:36.808Z",
    "nonce": "78c7f905-6091-4c7f-a63f-f8590242502f",
    "type": "Bloom-Presentation-1.0.0",
    "creator": "0x1cc73a01dab0d88060d86033d21c9068e601b84c",
    "domain": "placeholder"
  }
}
```

## Example

The endpoint specified in the QR code should be configured to accept data in the format shown in [ResponseData](#responsedata). In addition to using this library to validate the received data you should enusre that the `token` passed back is valid, it should be treated as a one-time use token to avoid replay attacks.

```typescript
import {validateVerifiablePresentationResponse} from '@bloomprotocol/verify-kit'

app.post('/scan', async (req, res) => {
  try {
    const verifiedData = await validateVerifiablePresentationResponse(req.body, {
      validateOnChain: env.validateOnChain,
      web3Provider: env.web3Provider,
    })
    if (verifiedData.kind === 'invalid') {
      res.status(400).json({
        success: false,
        message: 'Shared data is not valid',
        verifiedData,
      })
      return
    }
    const consumableData = verifiedData.data.verifiableCredential.map(v => v.credentialSubject.data)

    res.status(200).json({success: true, message: 'Data Received'})
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Something went wrong',
    })
  }
})
```

Or if you are expecting an auth reponse:

```typescript
import {validateVerifiableAuthResponse} from '@bloomprotocol/verify-kit'

app.post('/scan', async (req, res) => {
  try {
    const verifiedAuth = validateVerifiableAuthResponse(req.body)
    if (verifiedAuth.kind === 'invalid') {
      res.status(400).json({
        success: false,
        message: 'Auth is not valid',
        verifiedAuth,
      })
      return
    }

    res.status(200).json({success: true, message: 'Auth Received'})
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Something went wrong',
    })
  }
})
```

# Using Verify Kit for BloomID Sign-In

In conjuction with this libary you will use [Share Kit](https://github.com/hellobloom/vc/tree/master/packages/share-kit) to render an element to request users share their data with you.

Complete examples are available at [Bloom Starter](https://github.com/hellobloom/bloom-starter).
