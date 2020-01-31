import React from 'react'

import {Shell} from '../../components/Shell'
import {useLocalClient} from '../../components/LocalClientProvider'
import {Button} from '../../components/Button'

type HomeProps = {}

export const Home: React.FC<HomeProps> = props => {
  const {wallet, sdvcs, regen} = useLocalClient()

  return (
    <Shell>
      <h1 className="title is-1 has-text-weight-bold has-text-centered">Attestations Playground</h1>
      <p className="subtitle has-text-centered">Welcome to the Bloom attestation playground!</p>
      <div className="columns is-mobile is-centered">
        <div className="column">
          <Button onClick={() => regen()}>Regenerate Wallet</Button>
          <div>Your local wallet is: {wallet.getAddressString()}</div>
          {sdvcs.length > 0 ? (
            <React.Fragment>
              <div>And you current have the following credentials stored:</div>
              <ul>
                {sdvcs.map((sdvc, i) => (
                  <li key={i}>{sdvc}</li>
                ))}
              </ul>
            </React.Fragment>
          ) : (
            <div>You do not currently have any credentials stored</div>
          )}
        </div>
      </div>
    </Shell>
  )
}
