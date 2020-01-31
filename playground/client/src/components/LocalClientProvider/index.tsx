import React, {useContext} from 'react'
import createPersistedState from 'use-persisted-state'
import EthWallet from 'ethereumjs-wallet'
import {SDBatchVCV1} from '@bloomprotocol/attestations-common'

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
  shareVCs: (types: string[], to: string) => Promise<RequestResponse>
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

  return (
    <LocalClientContext.Provider
      value={{
        wallet: EthWallet.fromPrivateKey(Buffer.from(privateKey.replace('0x', ''), 'hex')),
        sdvcs,
        regen: () => {
          setPrivateKey(EthWallet.generate().getPrivateKeyString())
          setSDVCs([])
        },
        shareVCs: async (types, to) => {
          // TODO:
          // - Generate list of sdvcs from given types
          // - Use wallet to construct full vc and send them to the given url
          // - We'll need a way to tell the user if they don't have the necessary cred types stored

          return {
            kind: 'error',
            message: 'Something went wrong',
          }
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
