import React, {useState, useMemo} from 'react'
import {AttestationTypeNames, AttestationTypes} from '@bloomprotocol/attestations-common'
import {stripIndent} from 'common-tags'
import {Link} from 'react-router-dom'
import {FC} from 'react-forward-props'
import Fuse from 'fuse.js'
import {useDebounce} from 'react-use'

import {Shell} from '../../components/Shell'
import {api} from '../../api'
import {sitemap} from '../../sitemap'
import {Message, MessageHeader, MessageBody, MessageSkin} from '../../components/Message'
import {Card, CardContent, CardHeader, CardHeaderTitle} from '../../components/Card'
import {Button, ButtonSkin} from '../../components/Button'
import {Delete} from '../../components/Delete'
import {Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption} from '../../components/Combobox'
import {useLocalClient} from '../../components/LocalClientProvider'

import './index.scss'

const getDisplayValueForType = (type: string) => {
  const manifest = AttestationTypes[type as any]
  return manifest ? `${AttestationTypes[type as any].nameFriendly} (${type})` : type
}

type TypeConfigProps = {
  type: string
}

const TypeConfig: FC<'details', TypeConfigProps> = props => {
  return (
    <details className="request__type-config">
      <summary className="is-size-5 has-text-weight-bold">{getDisplayValueForType(props.type)}</summary>
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
              <label htmlFor={`${props.type}-completed-before`} className="label">
                Completed Before
              </label>
              <div className="control">
                <input id={`${props.type}-completed-before`} className="input" type="text" placeholder="Completed Before" />
              </div>
            </div>
          </div>
          <div className="column">
            <div className="field">
              <label htmlFor={`${props.type}-completed-after`} className="label">
                Completed After
              </label>
              <div className="control">
                <input id={`${props.type}-completed-after`} className="input" type="text" placeholder="Completed After" />
              </div>
            </div>
          </div>
        </div>
        <div className="columns">
          <div className="column">
            <div className="field">
              <label htmlFor={`${props.type}-provider-whitelist`} className="label">
                Provider Whitelist
              </label>
              <div className="control">
                <input id={`${props.type}-provider-whitelist`} className="input" type="text" placeholder="Provider Whitelist" />
              </div>
            </div>
          </div>
          <div className="column">
            <div className="field">
              <label htmlFor={`${props.type}-provider-blacklist`} className="label">
                Provider Blacklist
              </label>
              <div className="control">
                <input id={`${props.type}-provider-blacklist`} className="input" type="text" placeholder="Provider Blacklist" />
              </div>
            </div>
          </div>
        </div>
        <div className="columns">
          <div className="column">
            <div className="field">
              <label htmlFor={`${props.type}-attester-whitelist`} className="label">
                Provider Whitelist
              </label>
              <div className="control">
                <input id={`${props.type}-attester-whitelist`} className="input" type="text" placeholder="Attester Whitelist" />
              </div>
            </div>
          </div>
          <div className="column">
            <div className="field">
              <label htmlFor={`${props.type}-attester-blacklist`} className="label">
                Provider Blacklist
              </label>
              <div className="control">
                <input id={`${props.type}-attester-blacklist`} className="input" type="text" placeholder="Attester Blacklist" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </details>
  )
}

const useTypeMatch = (search: string) => {
  const {vcs} = useLocalClient()
  const [debouncedSearch, setDebouncedSearch] = useState(search)
  useDebounce(() => setDebouncedSearch(search), 500, [search])

  return useMemo(() => {
    const allTypesSet = new Set(vcs.map(vc => vc.type).flat())
    allTypesSet.delete('VerifiableCredential')

    if (debouncedSearch === '') return Array.from(allTypesSet)

    const result = new Fuse(
      Array.from(allTypesSet).map(type => ({type})),
      {
        shouldSort: false,
        tokenize: true,
        matchAllTokens: true,
        threshold: 0.2,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: ['type'],
      },
    )
      .search(debouncedSearch)
      .map(({type}) => type)

    return result
  }, [vcs, debouncedSearch])
}

type RequestProps = {}

export const Request: React.FC<RequestProps> = props => {
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set())
  const [customTypes, setCustomTypes] = useState<Set<string>>(new Set())
  const [newCustomType, setNewCustomType] = useState('')
  const matchingTypes = useTypeMatch(newCustomType)
  const [responseVersion, setResponseVersion] = useState('v0')

  const [newShareId, setNewShareId] = useState<string>()

  const handleResponseVersionChange: React.ChangeEventHandler<HTMLInputElement> = e => {
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

  const allRequestedTypes = [...Array.from(customTypes), ...Array.from(selectedTypes)]

  return (
    <Shell titleSuffix="Request">
      <h1 className="title is-1 has-text-weight-bold has-text-centered">Request Credentials</h1>
      <p className="subtitle has-text-centered">Create a request for credentials, including Bloom provided and third party credentials.</p>
      {newShareId && (
        <Message skin={MessageSkin.success}>
          <MessageHeader>
            <p>Request Successfully Created</p>
            <Delete onClick={() => setNewShareId(undefined)} aria-label="clear message" />
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
                <div className="request__add-types">
                  <div className="request__custom-types">
                    <form
                      onSubmit={e => {
                        e.preventDefault()

                        const newCustomTypes = new Set(customTypes)
                        newCustomTypes.add(newCustomType)

                        setCustomTypes(newCustomTypes)
                        setNewCustomType('')
                      }}
                      className="request__custom-types__add-form"
                    >
                      <div className="field has-addons">
                        <div className="control is-expanded">
                          <Combobox onSelect={value => setNewCustomType(value)}>
                            <ComboboxInput
                              placeholder="Custom Type"
                              value={newCustomType}
                              onChange={e => setNewCustomType(e.target.value.trim())}
                            />
                            {matchingTypes && matchingTypes.length > 0 && (
                              <ComboboxPopover>
                                <ComboboxList aria-label="Credential Types">
                                  {matchingTypes.slice(0, 10).map((type, index) => (
                                    <ComboboxOption key={index} value={type} />
                                  ))}
                                </ComboboxList>
                              </ComboboxPopover>
                            )}
                          </Combobox>
                        </div>
                        <div className="control">
                          <Button>Add</Button>
                        </div>
                      </div>
                    </form>
                    <div>
                      {Array.from(customTypes).map(customType => {
                        return (
                          <div className="request__custom-type" key={customType}>
                            <Delete
                              className="request__custom-type__delete"
                              onClick={() => {
                                const newCustomTypes = new Set(customTypes)
                                newCustomTypes.delete(customType)

                                setCustomTypes(newCustomTypes)
                              }}
                              aria-label="remove custom type"
                            />
                            {customType}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <div className="request__available-types">
                    {AttestationTypeNames.map(type => {
                      return (
                        <label key={type} className="request__type-checkbox checkbox">
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
                          {` ${getDisplayValueForType(type)}`}
                        </label>
                      )
                    })}
                  </div>
                </div>
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
                  {allRequestedTypes.map(type => (
                    <TypeConfig key={type} type={type} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="title is-4">Response Version:</div>
        <div className="field">
          <div className="control">
            <label className="radio">
              <input
                checked={responseVersion === 'v0'}
                type="radio"
                name="response-version"
                value="v0"
                onChange={handleResponseVersionChange}
              />
              {' V0'}
            </label>
            <label className="radio">
              <input
                checked={responseVersion === 'v1'}
                type="radio"
                name="response-version"
                value="v1"
                onChange={handleResponseVersionChange}
              />
              {' V1'}
            </label>
          </div>
        </div>
        <Button
          isDisabled={allRequestedTypes.length === 0}
          skin={ButtonSkin.link}
          onClick={async () => {
            const {id} = await api.share.create({types: allRequestedTypes, responseVersion})
            setNewShareId(id)
            setSelectedTypes(new Set())
            setCustomTypes(new Set())
          }}
        >
          Request
        </Button>
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
                org_name: 'VC Sandbox',
                org_logo_url: 'https://bloom.co/images/notif/bloom-logo.png',
                org_usage_policy_url: 'https://bloom.co/legal/terms',
                org_privacy_policy_url: 'https://bloom.co/legal/privacy',
                types: [${allRequestedTypes.map(type => `"${type}"`).join(', ')}]
              }
            `}
          </code>
        </pre>
      </div>
    </Shell>
  )
}
