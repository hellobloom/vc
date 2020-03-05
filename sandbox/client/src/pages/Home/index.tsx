import React, {useState} from 'react'

import {Shell} from '../../components/Shell'
import {useLocalClient} from '../../components/LocalClientProvider'
import {Button} from '../../components/Button'
import {JsonEditor} from '../../components/JsonEditor'
import {Delete} from '../../components/Delete'
import {BouncingDots} from '../../components/BouncingDots'

import './index.scss'

type HomeProps = {}

export const Home: React.FC<HomeProps> = props => {
  const {didConfig, vcs, regen, deleteVC} = useLocalClient()
  const [viewFullDID, setViewFullDID] = useState(false)

  return (
    <Shell>
      <h1 className="title is-1 has-text-weight-bold has-text-centered">VC Sandbox</h1>
      <p className="subtitle has-text-centered">Welcome to the Bloom VC sandbox!</p>
      <div className="columns is-mobile is-centered">
        <div className="column is-half-tablet">
          <h3 className="title is-3">Local DID:</h3>
          {didConfig ? (
            <React.Fragment>
              <div
                role="button"
                tabIndex={0}
                className="has-text-info home__did"
                title={`Click to view the ${viewFullDID ? 'truncated' : 'full'} DID`}
                onClick={() => setViewFullDID(viewFullDID => !viewFullDID)}
              >
                {viewFullDID ? didConfig.did : didConfig.did.split(';')[0]}
              </div>
              <Button className="home__regen-btn" onClick={() => regen()}>
                Regenerate DID
              </Button>
            </React.Fragment>
          ) : (
            <BouncingDots />
          )}
          <div className="is-divider" />
          <h3 className="title is-3">Local Credentials:</h3>
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
