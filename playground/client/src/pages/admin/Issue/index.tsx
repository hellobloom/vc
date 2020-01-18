import React from 'react'

import {AdminShell} from '../../../components/Shell'

type IssueProps = {}

export const Issue: React.FC<IssueProps> = props => {
  return <AdminShell titleSuffix="Issue" />
}
