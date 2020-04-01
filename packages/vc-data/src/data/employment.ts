import {VCV1} from '@bloomprotocol/vc-common'
import {Subject, MaybeArray, EmployeeRoleOrganization, OrganizationE} from './base'
import {Person, Role} from 'schema-dts'

export type EmployeeRolePerson = Role & {
  '@type': 'EmployeeRole'
  employee: Person
}
export type VCSEmploymentPerson = Subject<
  Person & {
    employeeOf: MaybeArray<EmployeeRoleOrganization>
  }
>
export type VCSEmploymentOrganization = Subject<
  OrganizationE & {
    employee: MaybeArray<EmployeeRolePerson>
  }
>
export type VCEmploymentPerson = VCV1<VCSEmploymentPerson>
export type VCEmploymentOrganization = VCV1<VCSEmploymentOrganization>
