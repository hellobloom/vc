import {VCV1} from '@bloomprotocol/vc-common'
import {Subject, MaybeArray, Credential, GovernmentOrg} from './base'
import {Person, Organization, MedicalClinic, QuantitativeValue, Drug, DefinedTerm} from 'schema-dts'
import {R4} from '@ahryman40k/ts-fhir-types'

//////////////////////////////////////////////////////////////
// Medical test VCs
//////////////////////////////////////////////////////////////

// FHIR types
export interface IImmunization extends R4.IImmunization {
  resourceType: 'Immunization'
  id: string
  status: string
  vaccineCode: R4.ICodeableConcept
  patient: R4.IReference
  encounter: R4.IReference
  occurrenceDateTime: string
  primarySource: boolean
  location: R4.IReference
  manufacturer: R4.IReference
  lotNumber: string
  site: R4.ICodeableConcept
  route: R4.ICodeableConcept
  doseQuantity: R4.IQuantity
}
export interface IObservation extends R4.IObservation {
  resourceType: 'Observation'
  category: Array<R4.ICodeableConcept>
  identifier: Array<R4.IIdentifier>
  status: R4.ObservationStatusKind
  method: R4.ICodeableConcept
  device: R4.IReference
  code: R4.ICodeableConcept
  subject: R4.IReference
  effectiveDateTime: string
  performer: Array<R4.IReference>
  component: Array<R4.IObservation_Component>
}
export type VCSMedicalFHIRImmunization = Subject<IImmunization>
export type VCSMedicalFHIRObservation = Subject<IObservation>

export type VCMedicalFHIRImmunization = VCV1<VCSMedicalFHIRImmunization>
export type VCMedicalFHIRObservation = VCV1<VCSMedicalFHIRObservation>

// Schema.org-based types
export type MedicalClinicE = MedicalClinic & {
  name?: string
  identifier?: string | number
  serviceTypes?: Array<string>
  jurisdiction?: GovernmentOrg
  website?: string // Website
}
export type MedicalTestCredential = Credential & {
  '@type': 'MedicalTestCredential' | string
  testClass?: string | DefinedTerm // E.g., 'antibody'
  testType?: string | DefinedTerm
  testManufacturer?: Organization | string | DefinedTerm
  sensitivity?: number // Out of 100
  specificity?: number // Out of 100
  clinic?: MedicalClinic
}

export type MedicalAntibodyTestCredential = MedicalTestCredential & {
  '@type': 'MedicalAntibodyTestCredential'
  pathogen?: string | DefinedTerm
  pathogenVariant?: string | DefinedTerm
  antibodyConcentration?: QuantitativeValue
  antibodyPresent?: boolean
}
export type MedicalPathogenLoadCredential = MedicalTestCredential & {
  '@type': 'MedicalPathogenLoadTestCredential'
  pathogen?: string | DefinedTerm
  pathogenVariant?: string | DefinedTerm
  pathogenConcentration?: QuantitativeValue
  pathogenPresent?: boolean
}
export type MedicalVaccinationCredential = MedicalTestCredential & {
  '@type': 'MedicalVaccinationTestCredential'
  pathogen?: string | DefinedTerm
  pathogenVariant?: string | DefinedTerm
  vaccine: Vaccine
}

export type Vaccine = Drug & {
  drugClass: 'vaccine'
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
export type VCSMedicalPathogenLoadPerson = Subject<
  VCSMedicalPersonBase & {
    hasMedicalPathogenLoadCredential: MaybeArray<MedicalPathogenLoadCredential>
  }
>
export type VCSMedicalVaccinationPerson = Subject<
  VCSMedicalPersonBase & {
    hasMedicalVaccinationCredential: MaybeArray<MedicalVaccinationCredential>
  }
>
export type VCSMedicalTestPerson = Subject<
  VCSMedicalPersonBase & {
    hasMedicalTestCredential: MaybeArray<MedicalTestCredential>
  }
>

export type VCMedicalAntibodyTestPerson = VCV1<VCSMedicalAntibodyTestPerson>
export type VCMedicalPathogenLoadPerson = VCV1<VCSMedicalPathogenLoadPerson>
export type VCMedicalVaccinationPerson = VCV1<VCSMedicalVaccinationPerson>
export type VCMedicalTestPerson = VCV1<VCSMedicalTestPerson>
