import React, {useState} from 'react'
import {AttestationTypeNames, AttestationTypes} from '@bloomprotocol/attestations-common'
import {stripIndent} from 'common-tags'
import {Link} from 'react-router-dom'
import {FixedSizeList as List, ListChildComponentProps} from 'react-window'

import {Shell} from '../../components/Shell'
import {api} from '../../api'
import {sitemap} from '../../sitemap'
import {Message, MessageHeader, MessageBody, MessageSkin} from '../../components/Message'
import {Card, CardContent, CardHeader, CardHeaderTitle} from '../../components/Card'

import './index.scss'

type RequestProps = {}

export const Request: React.FC<RequestProps> = props => {
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set(['phone']))
  const [responseVersion, setResponseVersion] = useState('v0')

  const [newShareId, setNewShareId] = useState<string>()

  const handleResponseVersionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.value) {
      case 'v0':
        setResponseVersion('v0')
        break
      case 'v1':
        setResponseVersion('v1')
        break
      default:
        throw new Error(`Unknown value: ${e.target.value}`)
    }
  }

  return (
    <Shell titleSuffix="Request">
      <h1 className="title is-1 has-text-weight-bold has-text-centered">Request Credentials</h1>
      <p className="subtitle has-text-centered">Create a request for credentials, including Bloom provided and third party credentials.</p>
      {newShareId && (
        <Message skin={MessageSkin.success}>
          <MessageHeader>
            <p>Request Successfully Created</p>
            <button onClick={() => setNewShareId(undefined)} className="delete" aria-label="delete"></button>
          </MessageHeader>
          <MessageBody>
            To share data for this request navigate to <Link to={sitemap.share(newShareId)}>{sitemap.share(newShareId)}</Link>.
          </MessageBody>
        </Message>
      )}
      <div>
        <div className="title is-4">Credential Types:</div>
        <div className="columns">
          <div className="column">
            <Card>
              <CardHeader>
                <CardHeaderTitle>Types</CardHeaderTitle>
              </CardHeader>
              <CardContent>
                <List itemData={AttestationTypeNames} itemCount={AttestationTypeNames.length} height={300} itemSize={30} width="100%">
                  {({index, data, style}: Omit<ListChildComponentProps, 'data'> & {data: string[]}) => {
                    const type = data[index]

                    return (
                      <label style={style} className="request__type-checkbox checkbox">
                        <input
                          checked={selectedTypes.has(type)}
                          onChange={() => {
                            const newSelectedTypes = new Set(selectedTypes)

                            if (!newSelectedTypes.delete(type)) {
                              newSelectedTypes.add(type)
                            }

                            setSelectedTypes(newSelectedTypes)
                          }}
                          type="checkbox"
                          name="attestation-type"
                        />
                        {' ' + AttestationTypes[type as any].nameFriendly}
                      </label>
                    )
                  }}
                </List>
              </CardContent>
            </Card>
          </div>
          <div className="column">
            <Card>
              <CardHeader>
                <CardHeaderTitle>Configuration</CardHeaderTitle>
              </CardHeader>
              <CardContent>
                <div className="request__type-configs">
                  {Array.from(selectedTypes).map(type => {
                    return (
                      <details key={type} className="request__type-config">
                        <summary className="is-size-5 has-text-weight-bold">{AttestationTypes[type as any].nameFriendly}</summary>
                        <div className="request__type-config__options">
                          <div className="request__type-config__options__coming-soon">
                            <div className="request__type-config__options__coming-soon__text is-size-3 has-text-centered">Coming Soon</div>
                          </div>
                          <div className="columns">
                            <div className="column">
                              <div className="field">
                                <div className="control">
                                  <label className="checkbox">
                                    <input type="checkbox" /> Optional
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="columns">
                            <div className="column">
                              <div className="field">
                                <label htmlFor={`${type}-completed-before`} className="label">
                                  Completed Before
                                </label>
                                <div className="control">
                                  <input id={`${type}-completed-before`} className="input" type="text" placeholder="Completed Before" />
                                </div>
                              </div>
                            </div>
                            <div className="column">
                              <div className="field">
                                <label htmlFor={`${type}-completed-after`} className="label">
                                  Completed After
                                </label>
                                <div className="control">
                                  <input id={`${type}-completed-after`} className="input" type="text" placeholder="Completed After" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="columns">
                            <div className="column">
                              <div className="field">
                                <label htmlFor={`${type}-provider-whitelist`} className="label">
                                  Provider Whitelist
                                </label>
                                <div className="control">
                                  <input id={`${type}-provider-whitelist`} className="input" type="text" placeholder="Provider Whitelist" />
                                </div>
                              </div>
                            </div>
                            <div className="column">
                              <div className="field">
                                <label htmlFor={`${type}-provider-blacklist`} className="label">
                                  Provider Blacklist
                                </label>
                                <div className="control">
                                  <input id={`${type}-provider-blacklist`} className="input" type="text" placeholder="Provider Blacklist" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="columns">
                            <div className="column">
                              <div className="field">
                                <label htmlFor={`${type}-attester-whitelist`} className="label">
                                  Provider Whitelist
                                </label>
                                <div className="control">
                                  <input id={`${type}-attester-whitelist`} className="input" type="text" placeholder="Attester Whitelist" />
                                </div>
                              </div>
                            </div>
                            <div className="column">
                              <div className="field">
                                <label htmlFor={`${type}-attester-blacklist`} className="label">
                                  Provider Blacklist
                                </label>
                                <div className="control">
                                  <input id={`${type}-attester-blacklist`} className="input" type="text" placeholder="Attester Blacklist" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </details>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="title is-4">
          Response Version: <span className="is-italic has-text-info">(Coming Soon)</span>
        </div>
        <div className="field">
          <div className="control">
            <label className="radio" {...{disabled: true}}>
              <input
                checked={responseVersion === 'v0'}
                type="radio"
                name="response-version"
                disabled
                value="v0"
                onChange={handleResponseVersionChange}
              />
              {' V0'}
            </label>
            <label className="radio" {...{disabled: true}}>
              <input
                checked={responseVersion === 'v1'}
                type="radio"
                name="response-version"
                disabled
                value="v1"
                onChange={handleResponseVersionChange}
              />
              {' V1'}
            </label>
          </div>
        </div>
        <button
          className="button is-link"
          onClick={async () => {
            const {id} = await api.share.createRequest({types: Array.from(selectedTypes), responseVersion})
            setNewShareId(id)
            setSelectedTypes(new Set())
          }}
        >
          Request
        </button>
      </div>
      <div className="request__output">
        <div className="title is-4">Output:</div>
        <pre>
          <code>
            {stripIndent`
          const requestData: RequestData = {
            action: Action.attestation,
            token: '...',
            url: '...',
            org_name: 'Attestation Playground',
            org_logo_url: 'https://bloom.co/images/notif/bloom-logo.png',
            org_usage_policy_url: 'https://bloom.co/legal/terms',
            org_privacy_policy_url: 'https://bloom.co/legal/privacy',
            types: [${Array.from(selectedTypes)
              .map(type => `"${type}"`)
              .join(', ')}]
          }
          `}
          </code>
        </pre>
      </div>
    </Shell>
  )
}
