import React, {useContext} from 'react'
import createPersistedState from 'use-persisted-state'
import EthWallet from 'ethereumjs-wallet'
import {SDBatchVCV1, SDVCV1, EthUtils} from '@bloomprotocol/attestations-common'
import wretch from 'wretch'
import * as ethSigUtil from 'eth-sig-util'

import {buildBatchFullVCV1, buildVerifiablePresentation, appendQuery} from './utils'

const usePrivateKeyState = createPersistedState('attestations-playground.privateKey')
const useSDVCsState = createPersistedState('attestations-playground.sdvcs')

type SuccessRequestResponse = {
  kind: 'success'
}

type ErrorRequestResponse = {
  kind: 'error'
  message: string
}

type RequestResponse = SuccessRequestResponse | ErrorRequestResponse

type LocalClientContextProps = {
  sdvcs: any[]
  wallet: EthWallet
  regen: () => void
  shareVCs: (types: string[], token: string, to: string) => Promise<RequestResponse>
  claimVC: (from: string, token: string) => Promise<RequestResponse>
}

const LocalClientContext = React.createContext<LocalClientContextProps>({
  sdvcs: [],
  wallet: EthWallet.generate(),
  regen: () => {},
  shareVCs: async () => ({kind: 'success'}),
  claimVC: async () => ({kind: 'success'}),
})

export const LocalClientProvider: React.FC = props => {
  const [privateKey, setPrivateKey] = usePrivateKeyState<string>(() => EthWallet.generate().getPrivateKeyString())
  const [sdvcs, setSDVCs] = useSDVCsState<SDBatchVCV1[]>(() => [])

  const wallet = EthWallet.fromPrivateKey(Buffer.from(privateKey.replace('0x', ''), 'hex'))

  return (
    <LocalClientContext.Provider
      value={{
        wallet,
        sdvcs,
        regen: () => {
          setPrivateKey(EthWallet.generate().getPrivateKeyString())
          setSDVCs([])
        },
        shareVCs: async (types, token, to) => {
          if (sdvcs.length === 0) {
            return {
              kind: 'error',
              message: 'You do not have any credentials stored locally',
            }
          }

          if (types.length === 0) {
            return {
              kind: 'error',
              message: 'Must request at least one credential type to share',
            }
          }

          const missing: string[] = []
          const foundSdvcs: SDBatchVCV1[] = []

          types.forEach(type => {
            // TODO: is this the way we should be checking?
            const foundVC = foundSdvcs.find(sdvc => sdvc.type.includes(type))

            if (foundVC) {
              foundSdvcs.push(foundVC)
            } else {
              missing.push(type)
            }
          })

          if (missing.length > 0) {
            return {
              kind: 'error',
              message: `You are missing the folowing credentials:\n${missing.join('\n')}`,
            }
          }

          const fullVcs = await Promise.all(
            foundSdvcs.map(
              async sdvc =>
                await buildBatchFullVCV1({
                  subject: `did:ethr:${wallet.getAddressString()}`,
                  stage: 'mainnet',
                  target: sdvc.credentialSubject.claimNodes[0],
                  sdvc: sdvc,
                  authorization: [],
                  wallet,
                }),
            ),
          )

          const vp = buildVerifiablePresentation({wallet, fullCredentials: fullVcs, token, domain: to})

          try {
            await wretch()
              .url(appendQuery(to, {'share-kit-from': 'qr'}))
              .post(vp)
              .json()
          } catch {
            return {
              kind: 'error',
              message: 'Something went wrong while sharing credentials',
            }
          }

          return {kind: 'success'}
        },
        claimVC: async (from, token) => {
          let sdvc: SDVCV1
          let batchUrl: string
          let contractAddress: string

          try {
            ;({credential: sdvc, batchUrl, contractAddress} = await wretch()
              .url(appendQuery(from, {'share-kit-from': 'qr'}))
              .post()
              .json<{credential: SDVCV1; batchUrl: string; contractAddress: string}>())
          } catch {
            return {
              kind: 'error',
              message: 'Something went wrong while fetching the VC to claim',
            }
          }

          let sdBatchVc: SDBatchVCV1

          const subjectSignature = ethSigUtil.signTypedData(wallet.getPrivateKey(), {
            data: EthUtils.getAttestationAgreement(contractAddress, 1, sdvc.proof.layer2Hash, token),
          })

          try {
            ;({sdBatchVc} = await wretch()
              .url(batchUrl)
              .post({credential: sdvc, subjectSignature})
              .json<{sdBatchVc: SDBatchVCV1}>())
          } catch {
            return {
              kind: 'error',
              message: 'Something went wrong while batching the VC to claim',
            }
          }

          setSDVCs([...sdvcs, sdBatchVc])

          return {kind: 'success'}
        },
      }}
    >
      {props.children}
    </LocalClientContext.Provider>
  )
}

export const useLocalClient = () => {
  return useContext(LocalClientContext)
}
