import {VCV1} from '@bloomprotocol/vc-common'
import {Subject} from './base'
import {Person} from 'schema-dts'

export type VCSDOBPerson = Subject<
  Person & {
    '@type': 'Person'
    birthDate: string
  }
>
export type VCDOBPerson = VCV1<VCSDOBPerson>
