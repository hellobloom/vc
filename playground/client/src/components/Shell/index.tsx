import React from 'react'
import {FC} from 'react-forward-props'
import {useDocumentTitle} from '../../utils/hooks'

const useDocumentTitleSuffix = (titleSuffix?: string) => {
  useDocumentTitle(titleSuffix ? `Attestation Playground - ${titleSuffix}` : 'Attestation Playground')
}

type ShellProps = {
  titleSuffix?: string
}

export const Shell: FC<'div', ShellProps> = props => {
  useDocumentTitleSuffix(props.titleSuffix)

  return <div>{props.children}</div>
}

type AdminShellProps = {
  titleSuffix?: string
}

export const AdminShell: FC<'div', AdminShellProps> = props => {
  useDocumentTitleSuffix(props.titleSuffix ? `Admin - ${props.titleSuffix}` : `Admin`)

  return <div>{props.children}</div>
}
