import React, {useContext} from 'react'
import createPersistedState from 'use-persisted-state'
import EthWallet from 'ethereumjs-wallet'

const useWalletState = createPersistedState('wallet')
const useSDVCsState = createPersistedState('sdvcs')

type LocalClientContextProps = {
  sdvcs: any[]
  wallet: EthWallet
  addSDVC: (sdvc: {}) => void
  shareVCs: (types: string[], to: string) => void
}

const LocalClientContext = React.createContext<LocalClientContextProps>({
  sdvcs: [],
  wallet: EthWallet.generate(),
  addSDVC: () => {},
  shareVCs: () => {},
})

export const LocalClientProvider: React.FC = props => {
  const [wallet] = useWalletState<EthWallet>(() => EthWallet.generate())
  const [sdvcs, setSDVCs] = useSDVCsState<any[]>(() => [])

  return (
    <LocalClientContext.Provider
      value={{
        wallet,
        sdvcs,
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
