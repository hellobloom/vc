import React from 'react'

import {Shell} from '../../components/Shell'
import {useLocalClient} from '../../components/LocalClientProvider'
import {Button} from '../../components/Button'
import {JsonEditor} from '../../components/JsonEditor'

import './index.scss'

type HomeProps = {}

export const Home: React.FC<HomeProps> = props => {
  const {wallet, sdvcs, regen} = useLocalClient()

  return (
    <Shell>
      <h1 className="title is-1 has-text-weight-bold has-text-centered">Attestations Playground</h1>
      <p className="subtitle has-text-centered">Welcome to the Bloom attestation playground!</p>
      <div className="columns is-mobile is-centered">
        <div className="column is-half-tablet">
          <h3 className="title is-3">Local Wallet:</h3>
          <div className="has-text-info">{wallet.getAddressString()}</div>
          <Button className="home__regen-btn" onClick={() => regen()}>
            Regenerate Wallet
          </Button>
          <div className="is-divider" />
          <h3 className="title is-3">Local Attestations:</h3>
          {sdvcs.length > 0 ? (
            <React.Fragment>
              {sdvcs.map((sdvc, i) => (
                <JsonEditor key={i} value={sdvc} />
              ))}
            </React.Fragment>
          ) : (
            <div>You do not have any credentials stored</div>
          )}
        </div>
      </div>
    </Shell>
  )
}
