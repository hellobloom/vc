import React from 'react'

import {Shell} from '../../components/Shell'

type HomeProps = {}

export const Home: React.FC<HomeProps> = props => {
  return (
    <Shell titleSuffix="Share">
      <h1 className="title is-1 has-text-weight-bold has-text-centered">Attestations Playground</h1>
      <p className="subtitle has-text-centered">Welcome to the Bloom attestation playground!</p>
    </Shell>
  )
}
