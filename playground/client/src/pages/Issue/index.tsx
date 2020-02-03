import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import {FC} from 'react-forward-props'
import {useId} from '@reach/auto-id'
import {stripIndent, codeBlock} from 'common-tags'

import {Shell} from '../../components/Shell'
import {Message, MessageSkin, MessageHeader, MessageBody} from '../../components/Message'
import {Delete} from '../../components/Delete'
import {sitemap} from '../../sitemap'
import {Button, ButtonSkin} from '../../components/Button'
import {Card, CardHeader, CardHeaderTitle, CardContent, CardFooter, CardFooterItem} from '../../components/Card'
import {api} from '../../api'
import {JsonEditor} from '../../components/JsonEditor'

import './index.scss'

type ClaimNodeInfo = {
  type: string
  version: string
  provider: string
  data: {}
}

type ClaimNodeBuilderProps = ClaimNodeInfo & {
  onTypeChange: (type: string) => void
  onVersionChange: (version: string) => void
  onProviderChange: (provder: string) => void
  onDataChange: (data: {}) => void
}

const ClaimNodeBuilder: FC<'div', ClaimNodeBuilderProps> = props => {
  const id = useId(props.id)

  return (
    <div>
      <div className="field">
        <label htmlFor={`${id}-type`} className="label">
          Type
        </label>
        <div className="control">
          <input
            required
            value={props.type}
            onChange={e => props.onTypeChange(e.target.value.trim())}
            id={`${id}-type`}
            className="input"
            type="text"
            placeholder="Type"
          />
        </div>
      </div>
      <div className="field">
        <label htmlFor={`${id}-version`} className="label">
          Version
        </label>
        <div className="control">
          <input
            required
            value={props.version}
            onChange={e => props.onVersionChange(e.target.value.trim())}
            id={`${id}-version`}
            className="input"
            type="text"
            placeholder="Version (1.0.0)"
          />
        </div>
      </div>
      <div className="field">
        <label htmlFor={`${id}-provider`} className="label">
          Provider (Optional)
        </label>
        <div className="control">
          <input
            value={props.provider}
            onChange={e => props.onProviderChange(e.target.value)}
            id={`${id}-provider`}
            className="input"
            type="text"
            placeholder="Provider (Optional)"
          />
        </div>
      </div>
      <div className="field">
        <label htmlFor={`${props.id}-data`} className="label">
          Data
        </label>
        <div className="control">
          <JsonEditor id={`${props.id}-data`} value={props.data} onChange={props.onDataChange} />
        </div>
      </div>
    </div>
  )
}

type IssueProps = {}

export const Issue: React.FC<IssueProps> = props => {
  const [newCredId, setNewCredId] = useState<string>()
  const [claimNodes, setClaimNodes] = useState<ClaimNodeInfo[]>([
    {
      type: '',
      version: '',
      provider: '',
      data: {},
    },
  ])

  const isDisabled = !claimNodes.every(({type, version, data}) => type.trim() !== '' && version.trim() !== '' && data !== null)

  return (
    <Shell titleSuffix="Issue">
      <h1 className="title is-1 has-text-weight-bold has-text-centered">Issue Credential</h1>
      <p className="subtitle has-text-centered">Create claim nodes for a credential.</p>
      {newCredId && (
        <Message skin={MessageSkin.success}>
          <MessageHeader>
            <p>Request Successfully Created</p>
            <Delete onClick={() => setNewCredId(undefined)} aria-label="clear message" />
          </MessageHeader>
          <MessageBody>
            To claim this credential navigate to <Link to={sitemap.claim(newCredId)}>{sitemap.claim(newCredId)}</Link>.
          </MessageBody>
        </Message>
      )}
      <div className="columns">
        <div className="column is-half">
          <Card>
            <CardHeader>
              <CardHeaderTitle className="issue__claim-nodes__title">Claim Nodes</CardHeaderTitle>
            </CardHeader>
            <CardContent>
              <div className="issue__claim-nodes__content">
                {claimNodes.map((claimNode, index) => {
                  const updateClaimNode = (cb: (claimNode: ClaimNodeInfo) => void) => {
                    const newClaimNodes = [...claimNodes]
                    const foundClaimNode = newClaimNodes[index]

                    cb(foundClaimNode)
                    setClaimNodes(newClaimNodes)
                  }

                  return (
                    <details className="issue__claim-node">
                      <summary className="is-size-5 has-text-weight-bold">
                        <div className="issue__claim-node__title">
                          <span>Node #{index}</span>
                          <Delete
                            onClick={() => {
                              const newClaimNodes = [...claimNodes]
                              newClaimNodes.splice(index, 1)
                              setClaimNodes(newClaimNodes)
                            }}
                            aria-label="Remove claim node"
                          />
                        </div>
                      </summary>
                      <ClaimNodeBuilder
                        key={index}
                        {...claimNode}
                        onTypeChange={type => {
                          updateClaimNode(node => (node.type = type))
                        }}
                        onVersionChange={version => {
                          updateClaimNode(node => (node.version = version))
                        }}
                        onProviderChange={provider => {
                          updateClaimNode(node => (node.provider = provider))
                        }}
                        onDataChange={data => {
                          updateClaimNode(node => (node.data = data))
                        }}
                      />
                    </details>
                  )
                })}
              </div>
            </CardContent>
            <CardFooter>
              <CardFooterItem>
                <Button
                  isFullwidth
                  onClick={() => {
                    setClaimNodes([
                      ...claimNodes,
                      {
                        type: '',
                        provider: '',
                        version: '',
                        data: {},
                      },
                    ])
                  }}
                >
                  Add Node
                </Button>
              </CardFooterItem>
            </CardFooter>
          </Card>
        </div>
        <div className="column is-half">
          <Card>
            <CardHeader>
              <CardHeaderTitle>Verifiable Credential</CardHeaderTitle>
            </CardHeader>
            <CardContent>
              <div className="issue__vc__content">
                <pre>
                  <code>
                    {codeBlock`
                    const vc = buildSDVCV1({
                      claimNodes: [
                        ${claimNodes
                          .map(node => {
                            const claimNodeStr = stripIndent`
                              buildClaimNodeV1({
                                dataStr: JSON.stringify(${JSON.stringify(node.data)}),
                                type: '${node.type}',
                                provider: ${node.provider ? `'${node.provider}'` : undefined},
                                version: '${node.version}',
                              })`
                            return claimNodeStr
                          })
                          .join(',\n')},
                      ],
                      subject: 'did:ethr:0x...',
                      issuanceDate: '...',
                      expirationDate: '...',
                      privateKey: 'did:ethr:0x...',
                    })
                  `}
                  </code>
                </pre>
              </div>
            </CardContent>
            <CardFooter>
              <CardFooterItem>
                <Button
                  isFullwidth
                  skin={ButtonSkin.info}
                  onClick={async () => {
                    const {id} = await api.cred.create({claimNodes})
                    setNewCredId(id)
                    setClaimNodes([
                      {
                        type: '',
                        provider: '',
                        version: '',
                        data: {},
                      },
                    ])
                  }}
                  isDisabled={isDisabled}
                >
                  Issue VC
                </Button>
              </CardFooterItem>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Shell>
  )
}
