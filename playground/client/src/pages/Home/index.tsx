import React from 'react'

import {Shell} from '../../components/Shell'

type HomeProps = {}

export const Home: React.FC<HomeProps> = props => {
  return <Shell titleSuffix="Share" />
}
