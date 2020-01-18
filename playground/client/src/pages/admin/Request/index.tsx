import React, {useState} from 'react'
import {AttestationTypeNames, TAttestationTypeNames, AttestationTypes} from '@bloomprotocol/attestations-common'
import R from 'ramda'
import {stripIndent} from 'common-tags'
import {Link} from 'react-router-dom'

import {AdminShell} from '../../../components/Shell'
import {api} from '../../../api'
import {sitemap} from '../../../sitemap'

type RequestProps = {}

export const Request: React.FC<RequestProps> = props => {
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set())
  const [newShareId, setNewShareId] = useState<string>()

  return (
    <AdminShell titleSuffix="Request">
      <h1>Request Attestations</h1>
      {newShareId && (
        <article className="message is-success">
          <div className="message-header">
            <p>Request Successfully Created</p>
            <button onClick={() => setNewShareId(undefined)} className="delete" aria-label="delete"></button>
          </div>
          <div className="message-body">
            To share data for this request navigate to <Link to={sitemap.share(newShareId)}>{sitemap.share(newShareId)}</Link>.
          </div>
        </article>
      )}
      <form
        onSubmit={async e => {
          e.preventDefault()
          const {id} = await api.share.createRequest({types: Array.from(selectedTypes)})
          setNewShareId(id)
          setSelectedTypes(new Set())
        }}
      >
        <div className="columns">
          {R.splitEvery(5, AttestationTypeNames as TAttestationTypeNames[]).map(types => (
            <div className="column">
              {types.map(type => (
                <label className="checkbox">
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
                  {AttestationTypes[type].nameFriendly}
                </label>
              ))}
            </div>
          ))}
        </div>
        <button className="button is-link" type="submit">
          Request
        </button>
      </form>
      <h2>Output:</h2>
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
    </AdminShell>
  )
}
