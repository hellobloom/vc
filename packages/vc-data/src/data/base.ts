import {
  AdministrativeArea,
  City,
  Corporation,
  Country,
  DefinedTerm,
  GovernmentOrganization,
  MonetaryAmount,
  Organization,
  PostalAddress,
  State,
  WebSite,
  PropertyValue,
} from 'schema-dts'

import {VCV1Subject, SimpleThing} from '@bloomprotocol/vc-common'

export type Modify<T, R> = Pick<T, Exclude<keyof T, keyof R>> & R
export type Extend<T, R> = Modify<Exclude<T, string>, R>
export type Subject<T extends SimpleThing | string> = VCV1Subject<Exclude<T, string>>

export type MaybeArray<T> = T | Array<T>

///////////////////////////////////////////////////////
// schema-dts type extensions
///////////////////////////////////////////////////////

export type GovernmentOrg =
  | Country
  | State
  | City
  | Organization
  | Corporation
  | GovernmentOrganization
  | (AdministrativeArea & {
      identifier?: 'string' // Issuer code
    })

export type MonetaryAmountR = MonetaryAmount & {
  currency: string
  value: number | string
}

export type EmployeeRoleOrganization = {
  '@type': 'EmployeeRole'
  employeeOf: OrganizationE
}

export type OrganizationE = Organization & {
  name?: string
  address?: MaybeArray<PostalAddress>
  legalName?: string
  dissolutionDate?: string
  hasCredential?: MaybeArray<CredentialU>
  telephone?: string
  faxNumber?: string
  email?: string
  website?: MaybeArray<WebSite>
}

export type CredentialU = OrganizationalCredential | Credential

export type Credential = {
  '@type': 'Credential'
  credentialCategory?: string
  additionalType?: string
  dateCreated?: string
  dateModified?: string
  dateRevoked?: string
  datePublished?: string
  recognizedBy?: MaybeArray<GovernmentOrg>
}

export type OrganizationalCredential = Credential & {
  credentialCategory: string // 'incorporation', 'foreign-registration'
  organizationType?: string | DefinedTerm
  goodStanding?: boolean // Company is in "good standing" with the recognizing authority
  active?: boolean // Company has "active" status within recognizing authority's jurisdiction
  identifier?: PropertyValue | string | number // e.g., taxId, can be a URI for specific schemes such as organizational tax IDs, or equivalent PropertyValue
  primaryJurisdiction?: boolean
}
