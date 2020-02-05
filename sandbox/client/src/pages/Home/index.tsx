import React from 'react'

import {Shell} from '../../components/Shell'
import {useLocalClient} from '../../components/LocalClientProvider'
import {Button} from '../../components/Button'
import {JsonEditor} from '../../components/JsonEditor'

import './index.scss'
import {Delete} from '../../components/Delete'

type HomeProps = {}

export const Home: React.FC<HomeProps> = props => {
  const {wallet, vcs, regen, deleteVC} = useLocalClient()

  return (
    <Shell>
      <h1 className="title is-1 has-text-weight-bold has-text-centered">VC Sandbox</h1>
      <p className="subtitle has-text-centered">Welcome to the Bloom VC sandbox!</p>
      <div className="columns is-mobile is-centered">
        <div className="column is-half-tablet">
          <h3 className="title is-3">Local Wallet:</h3>
          <div className="has-text-info">{wallet.getAddressString()}</div>
          <Button className="home__regen-btn" onClick={() => regen()}>
            Regenerate Wallet
          </Button>
          <div className="is-divider" />
          <h3 className="title is-3">Local Attestations:</h3>
          {vcs.length > 0 ? (
            <React.Fragment>
              {vcs.map((vc, i) => (
                <div className="columns home__vc" key={i}>
                  <div className="column is-narrow is-paddingless">
                    <Delete className="home__vc__delete-btn" onClick={() => deleteVC(i)} aria-label="Delete VC" />
                  </div>
                  <div className="column is-paddingless">
                    <JsonEditor value={vc} mode="tree" />
                  </div>
                </div>
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
