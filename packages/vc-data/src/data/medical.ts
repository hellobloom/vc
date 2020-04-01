import {VCV1} from '@bloomprotocol/vc-common'
import {Subject, MaybeArray, GovernmentOrg} from './base'
import {Person, Organization, MedicalClinic, QuantitativeValue} from 'schema-dts'

//////////////////////////////////////////////////////////////
// Medical test VCs
//////////////////////////////////////////////////////////////

export type MedicalClinicE = MedicalClinic & {
  name?: string
  identifier?: string | number
  serviceTypes?: Array<string>
  jurisdiction?: GovernmentOrg
  website?: string // Website
}
export type MedicalTestCredential = Credential & {
  '@type': 'MedicalTestCredential' | string
  testClass?: string // E.g., 'antibody'
  testType?: string
  testManufacturer?: Organization | string
  falsePositive?: number // Out of 100
  falseNegative?: number // Out of 100
  truePositive?: number // Out of 100
  trueNegative?: number // Out of 100
  clinic?: MedicalClinic
}

export type MedicalAntibodyTestCredential = MedicalTestCredential & {
  '@type': 'MedicalAntibodyTestCredential'
  antibodyPathogen?: string
  antibodyPathogenVariant?: string
  antibodyConcentration?: QuantitativeValue
}
export type VCSMedicalPersonBase = Person & {
  identifier: string // Some kind of stable identifier, e.g., social security or national ID number
  birthDate: string // ISO 8601
  honorificPrefix?: string
  honorificSuffix?: string
} & (
    | {
        name: string
      }
    | {
        givenName: string
        familyName: string
        additionalName?: string
      }
  )
export type VCSMedicalAntibodyTestPerson = Subject<
  VCSMedicalPersonBase & {
    hasMedicalAntibodyTestCredential: MaybeArray<MedicalAntibodyTestCredential>
  }
>
export type VCSMedicalTestPerson = Subject<
  VCSMedicalPersonBase & {
    hasMedicalTestCredential: MaybeArray<MedicalTestCredential>
  }
>

export type VCMedicalAntibodyTestPerson = VCV1<VCSMedicalAntibodyTestPerson>
export type VCMedicalTestPerson = VCV1<VCSMedicalTestPerson>
