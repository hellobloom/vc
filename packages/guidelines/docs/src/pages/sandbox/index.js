import React from 'react'
import {Redirect} from '@docusaurus/router'
import useBaseUrl from '@docusaurus/useBaseUrl'

const Home = () => <Redirect to={useBaseUrl('/sandbox/overview')} />

export default Home
