import React, {useContext} from 'react'
import createPersistedState from 'use-persisted-state'
import EthWallet from 'ethereumjs-wallet'
import {SDBatchVCV1} from '@bloomprotocol/attestations-common'
import wretch from 'wretch'

import {buildBatchFullVCV1, buildVerifiablePresentation} from './utils'

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
  claimVC: (from: string) => Promise<RequestResponse>
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
          const missing: string[] = []
          const sdvcs: SDBatchVCV1[] = []

          types.forEach(type => {
            // TODO: is this the way we should be checking?
            const foundVC = sdvcs.find(sdvc => sdvc.type.includes(type))

            if (foundVC) {
              sdvcs.push(foundVC)
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
            sdvcs.map(
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
              .url(to)
              .put(vp)
              .json()
          } catch {
            return {
              kind: 'error',
              message: 'Something went wrong while sharing credentials',
            }
          }

          return {kind: 'success'}
        },
        claimVC: async from => {
          // TODO:
          // - POST to the given URL
          // - Get the SDVCV1 back
          // - Sign it and send it back to the second URL
          // - Get the SDBatchVCV1 back and store it to local storage

          return {
            kind: 'error',
            message: 'Something went wrong',
          }
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
