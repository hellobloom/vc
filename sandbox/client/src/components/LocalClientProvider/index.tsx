import React, {useContext, useEffect} from 'react'
import createPersistedState from 'use-persisted-state'
import EthWallet from 'ethereumjs-wallet'
import {AtomicVCV1} from '@bloomprotocol/attestations-common'
import wretch from 'wretch'

import {buildVPV1, appendQuery, generateElemDID} from './utils'

const usePrivateKeyState = createPersistedState('vc-sandbox.didConfig')
const useSDVCsState = createPersistedState('vc-sandbox.sdvcs')

type DIDConfig = {
  did: string
  primaryKey: string
  recoveryKey: string
}

type DIDWalletConfig = {
  did: string
  primaryKey: EthWallet
  recoveryKey: EthWallet
}

type SuccessRequestResponse = {
  kind: 'success'
}

type ErrorRequestResponse = {
  kind: 'error'
  message: string
}

type RequestResponse = SuccessRequestResponse | ErrorRequestResponse

type LocalClientContextProps = {
  vcs: AtomicVCV1[]
  didConfig?: DIDWalletConfig
  regen: () => void
  deleteVC: (index: number) => void
  shareVCs: (types: string[], token: string, to: string) => Promise<RequestResponse>
  claimVC: (from: string) => Promise<RequestResponse>
}

const LocalClientContext = React.createContext<LocalClientContextProps>({
  vcs: [],
  regen: () => {},
  deleteVC: () => {},
  shareVCs: async () => ({kind: 'success'}),
  claimVC: async () => ({kind: 'success'}),
})

export const LocalClientProvider: React.FC = props => {
  const [unmappedDIDConfig, setDidConfig] = usePrivateKeyState<DIDConfig | undefined>()
  const [vcs, setVCs] = useSDVCsState<AtomicVCV1[]>(() => [])

  useEffect(() => {
    if (typeof unmappedDIDConfig !== 'undefined') return

    let current = true

    const get = async () => {
      const {did, primaryKey, recoveryKey} = await generateElemDID()

      if (current) {
        setDidConfig({
          did,
          primaryKey: primaryKey.getPrivateKeyString(),
          recoveryKey: recoveryKey.getPrivateKeyString(),
        })
      }
    }

    void get()

    return () => {
      current = false
    }
  }, [unmappedDIDConfig, setDidConfig])

  let didConfig: DIDWalletConfig | undefined

  if (unmappedDIDConfig) {
    didConfig = {
      did: unmappedDIDConfig.did,
      primaryKey: EthWallet.fromPrivateKey(Buffer.from(unmappedDIDConfig.primaryKey.replace('0x', ''), 'hex')),
      recoveryKey: EthWallet.fromPrivateKey(Buffer.from(unmappedDIDConfig.recoveryKey.replace('0x', ''), 'hex')),
    }
  }

  return (
    <LocalClientContext.Provider
      value={{
        didConfig,
        vcs,
        regen: async () => {
          const {did, primaryKey, recoveryKey} = await generateElemDID()
          setDidConfig({
            did,
            primaryKey: primaryKey.getPrivateKeyString(),
            recoveryKey: recoveryKey.getPrivateKeyString(),
          })
          setVCs([])
        },
        deleteVC: index => {
          const newVCs = [...vcs]
          newVCs.splice(index, 1)
          setVCs(newVCs)
        },
        shareVCs: async (types, token, to) => {
          try {
            if (typeof didConfig === 'undefined') {
              return {
                kind: 'error',
                message: 'You do not have a DID stored locally',
              }
            }

            if (vcs.length === 0) {
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
            const foundVCs: AtomicVCV1[] = []

            types.forEach(type => {
              // TODO: is this the way we should be checking?
              const foundVC = vcs.find(vc => vc.type.includes(type))

              if (foundVC) {
                foundVCs.push(foundVC)
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

            const vp = await buildVPV1({
              holder: {
                did: didConfig.did,
                keyId: `${didConfig.did}#primary`,
                publicKey: didConfig.primaryKey.getPublicKeyString(),
                privateKey: didConfig.primaryKey.getPrivateKeyString(),
              },
              atomicVCs: foundVCs,
              token,
              domain: to,
            })

            await wretch()
              .url(appendQuery(to, {'share-kit-from': 'qr'}))
              .post(vp)
              .json()

            return {kind: 'success'}
          } catch {
            return {
              kind: 'error',
              message: 'Something went wrong while sharing credentials',
            }
          }
        },
        claimVC: async from => {
          try {
            if (typeof didConfig === 'undefined') {
              return {
                kind: 'error',
                message: 'You do not have a DID stored locally',
              }
            }

            const {vc} = await wretch()
              .headers({credentials: 'same-origin', 'Content-Type': 'application/json'})
              .url(appendQuery(from, {'claim-kit-from': 'qr'}))
              .post({subject: didConfig.did})
              .json<{vc: AtomicVCV1}>()

            setVCs([...vcs, vc])

            return {kind: 'success'}
          } catch {
            return {
              kind: 'error',
              message: 'Something went wrong while fetching the VC to claim',
            }
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
