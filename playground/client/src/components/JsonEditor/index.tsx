import React, {useMemo} from 'react'
import {JsonEditor as JsonEditorBase} from 'jsoneditor-react'
import {FC} from 'react-forward-props'
import Ajv from 'ajv'
import ace from 'brace'
import 'brace/mode/json'

import 'jsoneditor-react/es/editor.min.css'

type JsonEditorProps = {
  value: {} | null
  onChange?: (value: any | null) => void
  mode: 'tree' | 'code'
  schema?: any
}

export const JsonEditor: FC<'div', JsonEditorProps> = props => {
  const ajv = useMemo(() => {
    return new Ajv({allErrors: true, verbose: true})
  }, [])

  return <JsonEditorBase ace={ace} ajv={ajv} value={props.value} onChange={props.onChange} mode={props.mode} schema={props.schema} />
}
