import React, {useContext} from 'react'
import createPersistedState from 'use-persisted-state'
import EthWallet from 'ethereumjs-wallet'

const usePrivateKeyState = createPersistedState('attestations-playground.privateKey')
const useSDVCsState = createPersistedState('attestations-playground.sdvcs')

type LocalClientContextProps = {
  sdvcs: any[]
  wallet: EthWallet
  regen: () => void
  addSDVC: (sdvc: {}) => void
  shareVCs: (types: string[], to: string) => void
}

const LocalClientContext = React.createContext<LocalClientContextProps>({
  sdvcs: [],
  wallet: EthWallet.generate(),
  regen: () => {},
  addSDVC: () => {},
  shareVCs: () => {},
})

export const LocalClientProvider: React.FC = props => {
  const [privateKey, setPrivateKey] = usePrivateKeyState<string>(() => EthWallet.generate().getPrivateKeyString())
  const [sdvcs, setSDVCs] = useSDVCsState<any[]>(() => [])

  return (
    <LocalClientContext.Provider
      value={{
        wallet: EthWallet.fromPrivateKey(Buffer.from(privateKey.replace('0x', ''), 'hex')),
        sdvcs,
        regen: () => {
          setPrivateKey(EthWallet.generate().getPrivateKeyString())
          setSDVCs([])
        },
        addSDVC: sdvc => {
          setSDVCs([...sdvcs, sdvc])
        },
        shareVCs: (types, to) => {
          // TODO:
          // - Generate list of sdvcs from given types
          // - Use wallet to construct full vc and send them to the given url
          // - We'll need a way to tell the user if they don't have the necessary cred types stored
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
