import {VCV1} from '@bloomprotocol/vc-common'
import {Subject, MaybeArray, GovernmentOrg} from './base'
import {Person, Organization, MedicalClinic} from 'schema-dts'

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
  '@type': 'Medical'
  testClass?: string // E.g., 'antibody'
  testType?: string
  testManufacturer?: Organization | string
  falsePositive?: number // Out of 100
  falseNegative?: number // Out of 100
  truePositive?: number // Out of 100
  trueNegative?: number // Out of 100
  clinic?: MedicalClinic
}

export type MedicalAntibodyCredential = MedicalTestCredential & {
  antibodyPathogen?: string
  antibodyPathogenVariant?: string
  antibodyMgPerMl?: number
}
export type VCSMedicalPerson = Subject<Person> & {
  '@type': 'Person'
  hasMedicalCredential: MaybeArray<MedicalAntibodyCredential>
}
export type VCMedicalPerson = VCV1<VCSMedicalPerson>
