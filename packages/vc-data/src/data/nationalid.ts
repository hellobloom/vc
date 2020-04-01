import {VCV1} from '@bloomprotocol/vc-common'
import {Subject, GovernmentOrg} from './base'
import {Person, Organization, Role, PropertyValue} from 'schema-dts'

//////////////////////////////////////////////////////////////
// SSN/National ID number
//////////////////////////////////////////////////////////////

export type NatPropertyValue = PropertyValue & {
  '@type': 'PropertyValue'
  propertyID: string
  value: string | number
}

export type NationalityRole = Role & {
  '@type': 'NationalityRole'
  nationality: GovernmentOrg
  identifier: NatPropertyValue
}

export type VCSNatIDNumPerson = Subject<
  Person & {
    nationality: NationalityRole
  }
>

export type VCSNatIDNumOrganization = Subject<
  Organization & {
    nationality: NationalityRole
  }
>

export type VCNatIDNumPerson = VCV1<VCSNatIDNumPerson>
export type VCNatIDNumOrganization = VCV1<VCSNatIDNumOrganization>
