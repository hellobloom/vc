import React, {useRef, useState, useEffect} from 'react'
import CodeBlock from '@theme/CodeBlock'
import {useId} from '@reach/auto-id'
import {
  renderRequestElement,
  RequestData,
  QROptions,
  ButtonOptions,
  ShouldRenderButton,
  RequestElementResult,
} from '@bloomprotcol/share-kit'

type RequestElementProps = {
  requestData: RequestData
  qrOptions: Partial<QROptions>
  buttonOptions: ButtonOptions
  shouldRenderButton: ShouldRenderButton
}

const RequestElement: React.FC<RequestElementProps> = props => {
  const container = useRef<HTMLDivElement>(null)
  const requestElementResult = useRef<RequestElementResult>()
  const {requestData, qrOptions, buttonOptions, shouldRenderButton} = props
  useEffect(() => {
    if (!container.current) return
    if (requestElementResult.current) {
      requestElementResult.current.update({
        requestData,
        buttonOptions,
        qrOptions,
      })
    } else {
      requestElementResult.current = renderRequestElement({
        container: container.current,
        requestData,
        shouldRenderButton,
        buttonOptions,
        qrOptions,
      })
    }
    return () => {
      requestElementResult.current?.remove()
      requestElementResult.current = undefined
    }
  }, [container, requestData, qrOptions, buttonOptions, shouldRenderButton])
  return <div ref={container} />
}

type InputProps = {
  label: React.ReactNode
  value: string
  onChange: React.ChangeEventHandler<HTMLInputElement>
}

const Input: React.FC<InputProps> = props => {
  const id = useId()
  return (
    <p>
      <label htmlFor={id}>
        <strong>{props.label} </strong>
      </label>
      <br className="margin-bottom--sm" />
      <input
        style={{
          borderColor: 'var(--ifm-color-content-secondary)',
          borderRadius: 'var(--ifm-global-radius)',
          borderStyle: 'solid',
          borderWidth: 'var(--ifm-global-border-width)',
          fontSize: 'var(--ifm-font-size-base)',
          padding: '0.5rem',
          width: '100%',
        }}
        id={id}
        value={props.value}
        onChange={props.onChange}
      />
    </p>
  )
}

export const Demo = () => {
  const [url, setUrl] = useState('')
  const [hideLogo, setHideLogo] = useState(true)
  const [buttonCallbackUrl, setButtonCallbackUrl] = useState('')
  const [fgColor, setFgColor] = useState('#6067f1')
  const [bgColor, setBgColor] = useState('#fff')
  const [checkedTypes, setCheckedTypes] = useState(new Set())
  return (
    <div className="row">
      <div className="col col--6">
        <Input label="Url" value={url} onChange={event => setUrl(event.target.value)} />
        <Input label="Button Callback Url" value={buttonCallbackUrl} onChange={event => setButtonCallbackUrl(event.target.value)} />
      </div>
      <div className="col col--6">
        <div className="card">
          <div className="card__body">
            <div className="row" style={{justifyContent: 'center'}}>
              <RequestElement
                qrOptions={{size: 256}}
                requestData={{
                  version: 1,
                  url,
                }}
                shouldRenderButton={false}
                buttonOptions={{callbackUrl: buttonCallbackUrl}}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
