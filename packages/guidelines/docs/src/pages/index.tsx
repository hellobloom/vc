import React from 'react'
import Layout from '@theme/Layout'

import './index.scss'

type DocCardProps = {
  name: string
  link: string
  description: React.ReactNode
}

const DocCard: React.FC<DocCardProps> = props => {
  return (
    <div className="card card--full-height">
      <div className="card__header">
        <h3>{props.name}</h3>
      </div>
      <div className="card__body">
        <p>{props.description}</p>
      </div>
      <div className="card__footer">
        <a href={props.link} className="button button--secondary button--block">
          Read More
        </a>
      </div>
    </div>
  )
}

type DocGroups = {
  [key: string]: {
    docs: DocCardProps[]
  }
}

const docGroups: DocGroups = {
  'Front End': {
    docs: [
      {
        name: 'Share Kit',
        description: 'Easily allow your users to share their verified personal information directly with your application.',
        link: '/documentation/share-kit',
      },
      {
        name: 'Claim Kit',
        description: 'Easily allow users to claim verifiable credentials.',
        link: '/documentation/claim-kit',
      },
    ],
  },
  'Back End': {
    docs: [
      {
        name: 'Verify Kit',
        description: 'Validate shared verifiable presentations shared by users, powered by JSON-LD proofs.',
        link: '/documentation/verify-kit',
      },
      {
        name: 'Issue Kit',
        description: 'Issue signed verifiable credentials that users can claim and reuse at later times.',
        link: '/documentation/issue-kit',
      },
    ],
  },
  Utility: {
    docs: [
      {
        name: 'VC Common',
        description: 'Shared utilities and types for verifiable credentials and DIDs.',
        link: '/documentation/vc-common',
      },
      {
        name: 'VC Data',
        description: 'Type definitions and JSON-LD contexts for VC types.',
        link: '/documentation/vc-data',
      },
    ],
  },
  Guide: {
    docs: [
      {
        name: 'Sandbox',
        description: 'Learn about how to use to VC Sandbox.',
        link: '/documentation/sandbox',
      },
      {
        name: 'Implementation Guidelines',
        description: 'Learn how to implement your own Bloom client that interacts with VCs.',
        link: '/documentation/implementation-guidelines',
      },
    ],
  },
}

const Home = () => {
  return (
    <Layout title={`Documentation | Bloom`} description="Documentation for all things Bloom!">
      <header className="hero hero--primary">
        <div className="container">
          <h1 className="hero__title">Bloom Docs</h1>
          <p className="hero__subtitle">Welcome to the homepage of documentation for Bloom!</p>
        </div>
      </header>
      <main>
        <section className="padding-vert--md">
          <div className="container">
            <React.Fragment>
              {Object.keys(docGroups).map(groupName => {
                const {docs} = docGroups[groupName]
                return (
                  <div key={groupName} className="home__doc-group">
                    <h3>{groupName}</h3>
                    <div className="row home__doc-group__docs">
                      {docs.map(doc => (
                        <div className="col col--4">
                          <DocCard key={doc.name} {...doc} />
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </React.Fragment>
          </div>
        </section>
      </main>
    </Layout>
  )
}
export default Home
