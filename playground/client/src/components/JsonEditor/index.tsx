import React from 'react'
import {JsonEditor as JsonEditorBase} from 'jsoneditor-react'
import {FC} from 'react-forward-props'

import 'jsoneditor-react/es/editor.min.css'

type JsonEditorProps = {
  value: {}
  onChange?: (value: {}) => void
}

export const JsonEditor: FC<'div', JsonEditorProps> = props => <JsonEditorBase value={props.value} onChange={props.onChange} mode="tree" />
