import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import {FC} from 'react-forward-props'
import {useId} from '@reach/auto-id'
import {codeBlock} from 'common-tags'
import S from 'fluent-schema'
import {SimpleThing} from '@bloomprotocol/vc-common'
import {PrismAsyncLight as SyntaxHighlighter} from 'react-syntax-highlighter'
import ts from 'react-syntax-highlighter/dist/esm/languages/prism/typescript'
import coy from 'react-syntax-highlighter/dist/esm/styles/prism/coy'
import {uuid} from 'uuidv4'

import {Shell} from '../../components/Shell'
import {Message, MessageSkin, MessageHeader, MessageBody} from '../../components/Message'
import {Delete} from '../../components/Delete'
import {sitemap} from '../../sitemap'
import {Button, ButtonSkin} from '../../components/Button'
import {Card, CardHeader, CardHeaderTitle, CardContent, CardFooter, CardFooterItem} from '../../components/Card'
import {api} from '../../api'
import {JsonEditor} from '../../components/JsonEditor'

import './index.scss'

SyntaxHighlighter.registerLanguage('typescript', ts)

type DataMapping = {
  id: string
  datum: SimpleThing | null
  subject: string
}

type AtomicVCBuilderProps = {
  type: string
  data: DataMapping[]
  onTypeChange: (type: string) => void
  onDataChange: (data: DataMapping[]) => void
}

const AtomicVCBuilder: FC<'div', AtomicVCBuilderProps> = props => {
  const id = useId(props.id)

  return (
    <div>
      <div className="field">
        <label htmlFor={`${id}-type`} className="label">
          Credential Type
        </label>
        <div className="control">
          <input
            required
            value={props.type}
            onChange={e => props.onTypeChange(e.target.value.trim())}
            id={`${id}-type`}
            className="input"
            type="text"
            placeholder="Credential Type (AlumniCredential)"
          />
        </div>
      </div>
      <div className="is-divider" />
      {props.data.map(({id: dataId, datum, subject}, index) => (
        <React.Fragment key={dataId}>
          <div className="field">
            <label htmlFor={`${id}-subject`} className="label">
              Credential Subject{props.data.length > 1 ? ` ${index}` : ''}
            </label>
            <div className="control">
              <input
                required
                value={subject}
                onChange={e => {
                  const newData = [...props.data]
                  const foundDatum = newData.find(d => d.id === dataId)
                  if (!foundDatum) return
                  foundDatum.subject = e.target.value.trim()
                  props.onDataChange(newData)
                }}
                id={`${id}-subject`}
                className="input"
                type="text"
                placeholder="Credential Subject (did:elem:Ei...)"
              />
            </div>
            <p className="help">Leave blank if subject is claiming the credential</p>
          </div>
          <div className="field">
            <label htmlFor={`${id}-data-${index}`} className="label">
              Credential Data{props.data.length > 1 ? ` ${index}` : ''}
            </label>
            <div className="control">
              <JsonEditor
                mode="code"
                id={`${id}-data-${index}`}
                value={datum}
                onChange={newDatum => {
                  const newData = [...props.data]
                  const foundDatum = newData.find(d => d.id === dataId)
                  if (!foundDatum) return
                  foundDatum.datum = newDatum
                  props.onDataChange(newData)
                }}
                schema={S.object()
                  .prop('@type', S.string())
                  .required(['@type'])
                  .valueOf()}
              />
              <p className="help">
                Must extend from{' '}
                <a href="https://schema.org/Thing" target="_blank" rel="noopener noreferrer">
                  schema.org/Thing
                </a>
              </p>
              <p className="help">Use {'{{claimer}}'} as a placeholder for the claimer's DID</p>
            </div>
          </div>
          {index !== props.data.length - 1 && <div className="is-divider" />}
        </React.Fragment>
      ))}
    </div>
  )
}

const buildOutputString = (data: DataMapping[], type: string) => {
  if (data.length === 1) {
    return codeBlock`
      const credentialSubject = await buildAtomicVCSubectV1({
        data: ${JSON.stringify(data[0].datum)},
        subject: '${data[0].subject || '{{claimer}}'}',
      })

      const atomicVC = await buildAtomicVCV1({
        type: '${type}'
        credentialSubject,
        issuanceDate: '...',
        expirationDate: '...',
        privateKey: Buffer.from('...', 'hex'),
      })`
  } else {
    const subjectStrings = data.map(({datum, subject}, index) => {
      return `const credentialSubject${index} = await buildAtomicVCSubectV1({
        data: ${JSON.stringify(datum)},
        subject: '${subject || '{{claimer}}'}',
      })\n`
    })

    return codeBlock`
      ${subjectStrings}
      const atomicVC = await buildAtomicVCV1({
        type: '${type}'
        credentialSubject: [${data.map((_, i) => `credentialSubject${i}`)}],
        issuanceDate: '...',
        expirationDate: '...',
        privateKey: Buffer.from('...', 'hex'),
      })`
  }
}

type IssueProps = {}

export const Issue: React.FC<IssueProps> = props => {
  const [newCredId, setNewCredId] = useState<string>()
  const [errorMessage, setErrorMessage] = useState<string>()
  const [type, setType] = useState('')
  const [data, setData] = useState<DataMapping[]>([{id: uuid(), datum: {'@type': ''}, subject: ''}])

  const isDisabled = type.trim() === '' || data.some(({datum}) => datum === null)

  return (
    <Shell titleSuffix="Issue">
      <h1 className="title is-1 has-text-weight-bold has-text-centered">Issue Credential</h1>
      <p className="subtitle has-text-centered">Create claim nodes for a credential.</p>
      {newCredId && (
        <Message skin={MessageSkin.success}>
          <MessageHeader>
            <p>Credential Successfully Created</p>
            <Delete onClick={() => setNewCredId(undefined)} aria-label="clear message" />
          </MessageHeader>
          <MessageBody>
            To claim this credential navigate to <Link to={sitemap.claim(newCredId)}>{sitemap.claim(newCredId)}</Link>.
          </MessageBody>
        </Message>
      )}
      {errorMessage && (
        <Message skin={MessageSkin.danger}>
          <MessageHeader>
            <p>Request Failed</p>
            <Delete onClick={() => setErrorMessage(undefined)} aria-label="clear message" />
          </MessageHeader>
          <MessageBody>{errorMessage}</MessageBody>
        </Message>
      )}
      <div className="columns">
        <div className="column is-half">
          <Card>
            <CardHeader>
              <CardHeaderTitle>Configuration</CardHeaderTitle>
            </CardHeader>
            <CardContent>
              <AtomicVCBuilder type={type} data={data} onTypeChange={setType} onDataChange={setData} />
            </CardContent>
            <CardFooter>
              <CardFooterItem>
                <Button
                  isFullwidth
                  onClick={() => {
                    setData([...data, {id: uuid(), datum: {'@type': ''}, subject: ''}])
                  }}
                >
                  Add Another Data Object
                </Button>
              </CardFooterItem>
            </CardFooter>
          </Card>
        </div>
        <div className="column is-half">
          <Card>
            <CardHeader>
              <CardHeaderTitle>Output</CardHeaderTitle>
            </CardHeader>
            <CardContent>
              <SyntaxHighlighter className="issue__output__code" language="typescript" style={coy}>
                {buildOutputString(data, type)}
              </SyntaxHighlighter>
            </CardContent>
            <CardFooter>
              <CardFooterItem>
                <Button
                  isFullwidth
                  skin={ButtonSkin.info}
                  onClick={async () => {
                    try {
                      const {id} = await api.cred.create({type, data})
                      setNewCredId(id)
                      setType('')
                      setData([{id: uuid(), datum: {'@type': ''}, subject: ''}])
                    } catch {
                      setErrorMessage('Something went wrong while creating the credential')
                    }
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
