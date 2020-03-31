export * from './base'
export * from './name'
export * from './phone'
export * from './email'
export * from './aml'
export * from './iddocument'
export * from './nationalid'
export * from './address'
export * from './dob'
export * from './gender'
export * from './account'
export * from './employment'
export * from './credit'
export * from './meta'

/**
 * +--------- Table of implemented attestation types -----------+
 *
 * Key:
 * +------------------------------------------------------------+
 * | X | Completed                                              |
 * | M | Missing                                                |
 * | D | Deprecated                                             |
 * | - | Unimplemented                                          |
 * +------------------------------------------------------------+
 *
 * +------------------------------------------------------------------------------------------------+
 * | X | 0  | phone                | VCPhonePerson, VCPhoneOrganization                             |
 * | X | 1  | email                | VCEmailPerson, VCEmailOrganization                             |
 * | D | 2  | facebook             | VCAccountPerson                                                |
 * | X | 3  | sanction-screen      | VCAMLPerson, VCAMLOrganization                                 |
 * | X | 4  | pep-screen           | VCAMLPerson, VCAMLOrganization                                 |
 * | X | 5  | id-document          | VCIDDocPerson                                                  |
 * | D | 6  | google               | VCAccountPerson                                                |
 * | D | 7  | linkedin             | VCAccountPerson                                                |
 * | D | 8  | twitter              | VCAccountPerson                                                |
 * | - | 9  | payroll              |                                                                |
 * | X | 10 | ssn                  | VCNatIDNumPerson, VCNatIDNumOrganization                       |
 * | - | 11 | criminal             |                                                                |
 * | - | 12 | offense              |                                                                |
 * | - | 13 | driving              |                                                                |
 * | X | 14 | employment           | VCEmploymentPerson, VCEmploymentOrganization                   |
 * | - | 15 | education            |                                                                |
 * | - | 16 | drug                 |                                                                |
 * | - | 17 | bank                 |                                                                |
 * | X | 18 | utility              | VCAccountPerson, VCAccountOrganization                         |
 * | X | 19 | income               | VCAccountPerson, VCAccountOrganization                         |
 * | X | 20 | assets               | VCAccountPerson, VCAccountOrganization                         |
 * | X | 21 | 'full-name'          | VCNamePerson, VCNameOrganization                               |
 * | X | 22 | 'birth-date'         | VCDOBPerson                                                    |
 * | X | 23 | gender               | VCGenderPerson                                                 |
 * | - | 24 | group                |                                                                |
 * | X | 25 | meta                 | VCMeta                                                         |
 * | - | 26 | office               |                                                                |
 * | - | 27 | credential           |                                                                |
 * | - | 28 | medical              |                                                                |
 * | - | 29 | biometric            |                                                                |
 * | - | 30 | supplemental         |                                                                |
 * | - | 31 | vouch                |                                                                |
 * | - | 32 | audit                |                                                                |
 * | X | 33 | address              | VCAddressPerson, VCAddressOrganization                         |
 * | - | 34 | correction           |                                                                |
 * | X | 35 | account              | VCAccountPerson, VCAccountOrganization                         |
 * +------------------------------------------------------------------------------------------------+
 */
