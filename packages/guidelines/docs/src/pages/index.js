import React from 'react'
import classnames from 'classnames'
import Layout from '@theme/Layout'

const Home = () => {
  return (
    <Layout title={`Documentation | Bloom`} description="Documentation for all things Bloom!">
      <header className={classnames('hero hero--primary')}>
        <div className="container">
          <h1 className="hero__title">Bloom Docs</h1>
          <p className="hero__subtitle">Welcome to the homepage of documentation for Bloom!</p>
        </div>
      </header>
      <main>
        <a className={classnames('button button--outline button--secondary button--lg')} href="/documentation/vc-data">
          VC Data
        </a>
      </main>
    </Layout>
  )
}
export default Home
