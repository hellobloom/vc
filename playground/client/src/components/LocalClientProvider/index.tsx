import React, {useContext} from 'react'
import createPersistedState from 'use-persisted-state'
import EthWallet from 'ethereumjs-wallet'
import {AtomicVCV1} from '@bloomprotocol/attestations-common'
import wretch from 'wretch'

import {buildVPV1, appendQuery} from './utils'

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
  vcs: AtomicVCV1[]
  wallet: EthWallet
  regen: () => void
  deleteVC: (index: number) => void
  shareVCs: (types: string[], token: string, to: string) => Promise<RequestResponse>
  claimVC: (from: string) => Promise<RequestResponse>
}

const LocalClientContext = React.createContext<LocalClientContextProps>({
  vcs: [],
  wallet: EthWallet.generate(),
  regen: () => {},
  deleteVC: () => {},
  shareVCs: async () => ({kind: 'success'}),
  claimVC: async () => ({kind: 'success'}),
})

export const LocalClientProvider: React.FC = props => {
  const [privateKey, setPrivateKey] = usePrivateKeyState<string>(() => EthWallet.generate().getPrivateKeyString())
  const [vcs, setVCs] = useSDVCsState<AtomicVCV1[]>(() => [])

  const wallet = EthWallet.fromPrivateKey(Buffer.from(privateKey.replace('0x', ''), 'hex'))

  return (
    <LocalClientContext.Provider
      value={{
        wallet,
        vcs,
        regen: () => {
          setPrivateKey(EthWallet.generate().getPrivateKeyString())
          setVCs([])
        },
        deleteVC: index => {
          const newVCs = [...vcs]
          newVCs.splice(index, 1)
          setVCs(newVCs)
        },
        shareVCs: async (types, token, to) => {
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

          const vp = await buildVPV1({wallet, atomicVCs: foundVCs, token, domain: to})

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
        claimVC: async from => {
          let vc: AtomicVCV1

          try {
            ;({vc} = await wretch()
              .headers({credentials: 'same-origin', 'Content-Type': 'application/json'})
              .url(appendQuery(from, {'claim-kit-from': 'qr'}))
              .post({subject: `did:ethr:${wallet.getAddressString()}`})
              .json<{vc: AtomicVCV1}>())
          } catch {
            return {
              kind: 'error',
              message: 'Something went wrong while fetching the VC to claim',
            }
          }

          setVCs([...vcs, vc])

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
