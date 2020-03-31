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
  '@type': 'MedicalAntibodyTestCredential' | string
  antibodyPathogen?: string
  antibodyPathogenVariant?: string
  antibodyMgPerMl?: number
}
export type VCSMedicalAntibodyTestPerson = Subject<Person> & {
  '@type': 'Person'
  hasMedicalAntibodyTestCredential: MaybeArray<MedicalAntibodyTestCredential>
}
export type VCSMedicalTestPerson = Subject<Person> & {
  '@type': 'Person'
  hasMedicalTestCredential: MaybeArray<MedicalAntibodyTestCredential>
}
export type VCMedicalAntibodyTestPerson = VCV1<VCSMedicalAntibodyTestPerson>
export type VCMedicalTestPerson = VCV1<VCSMedicalTestPerson>
