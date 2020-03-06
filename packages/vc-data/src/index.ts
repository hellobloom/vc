import {
  Person,
  Organization,
  Corporation,
  MonetaryAmount,
  Date as TDate,
  GenderType,
  Country,
  GovernmentOrganization,
  State,
  City,
  AdministrativeArea,
  PostalAddress,
  WebSite,
} from 'schema-dts';

import {
  AtomicVCV1,
  AtomicVCSubjectV1,
  SimpleThing,
} from '@bloomprotocol/attestations-common';

export type Modify<T, R> = Pick<T, Exclude<keyof T, keyof R>> & R;
export type Extend<T, R> = Modify<Exclude<T, string>, R>;
export type Subject<T extends SimpleThing | string> = AtomicVCSubjectV1<
  Exclude<T, string>
>;
export type MaybeArray<T> = T | Array<T>;
export type GovernmentOrg =
  | Country
  | State
  | City
  | Organization
  | Corporation
  | GovernmentOrganization
  | (AdministrativeArea & {
      identifier?: 'string'; // Issuer code
    });
//////////////////////////////////////////////////////////////
// Name
//////////////////////////////////////////////////////////////
export interface VCSNamePerson extends Subject<Person> {
  '@type': 'Person';
  name: string;
}
export interface VCSNameOrganization extends Subject<Organization> {
  '@type': 'Organization';
  name: string;
}
export type VCNamePerson = AtomicVCV1<VCSNamePerson>;
export type VCNameOrganization = AtomicVCV1<VCSNameOrganization>;

//////////////////////////////////////////////////////////////
// Phone
//////////////////////////////////////////////////////////////
export interface VCSPhonePerson extends Subject<Person> {
  '@type': 'Person';
  telephone: string;
}
export interface VCSPhoneOrganization extends Subject<Organization> {
  '@type': 'Organization';
  telephone: string;
}
export type VCPhonePerson = AtomicVCV1<VCSPhonePerson>;
export type VCPhoneOrganization = AtomicVCV1<VCSPhoneOrganization>;

//////////////////////////////////////////////////////////////
// Email
//////////////////////////////////////////////////////////////
export interface VCSEmailPerson extends Subject<Person> {
  '@type': 'Person';
  email: string;
}
export interface VCSEmailOrganization extends Subject<Organization> {
  '@type': 'Person';
  email: string;
}
export type VCEmailPerson = AtomicVCV1<VCSEmailPerson>;
export type VCEmailOrganization = AtomicVCV1<VCSEmailOrganization>;

//////////////////////////////////////////////////////////////
// AML (sanction screen/PEP)
//////////////////////////////////////////////////////////////
export interface IBaseAttList {
  name?: string;
  url?: string;
}
export interface IBaseAttHit {
  id?: string;
  hitName?: string;
}
export interface TAMLSearch {
  '@type': 'AMLSearch';
  hitLocation?: string;
  hitNumber?: number;
  lists?: Array<IBaseAttList>;
  recordId?: string;
  searchReferenceId?: string;
  score?: string;
  hits?: Array<IBaseAttHit>;
  flagType?: string;
  comment?: string;
}
export interface VCSAMLPerson extends Subject<Person> {
  '@type': 'Person';
  hasAMLSearch: TAMLSearch;
}
export interface VCSAMLOrganization extends Subject<Organization> {
  '@type': 'Organization';
  hasAMLSearch: TAMLSearch;
}
export type VCAMLPerson = AtomicVCV1<VCSAMLPerson>;
export type VCAMLOrganization = AtomicVCV1<VCSAMLOrganization>;

//////////////////////////////////////////////////////////////
// ID document
//////////////////////////////////////////////////////////////

export type TDocumentClass =
  | 'unknown'
  | 'passport'
  | 'visa'
  | 'drivers_license'
  | 'identification_card'
  | 'permit'
  | 'currency'
  | 'residence_document'
  | 'travel_document'
  | 'birth_certificate'
  | 'vehicle_registration'
  | 'other'
  | 'weapon_license'
  | 'tribal_identification'
  | 'voter_identification'
  | 'military';

export interface VCSIDDocPerson extends Subject<Person> {
  '@type': 'Person';
  age?: number;
  birthDate?: TDate;
  familyName?: string;
  givenName?: string;
  gender?: MaybeArray<GenderType | string>;
  name?: MaybeArray<string>;
  nationality?: MaybeArray<Country>;
  hasIDDocument: MaybeArray<{
    '@type': 'IDDocumentRole';
    authenticationResult?: string;
    selfieImage?: string;
    faceMatch?: MaybeArray<{
      '@type': 'IDDocumentFaceMatch';
      isMatch?: boolean;
      score?: number;
      identifier?: number;
    }>;
    hasIDDocument: MaybeArray<{
      '@type': 'IDDocument';
      issuer: GovernmentOrg & { identifier?: 'string' };
      documentType?: string;
      issueDate?: TDate;
      issueType?: string;
      expirationDate?: TDate;
      classificationMethod?: 'automatic' | 'manual';
      idClass: TDocumentClass;
      idClassName?: string;
      countryCode?: string;
      frontImage?: string;
      backImage?: string;
      generic?: boolean;
      keesingCode?: string;
    }>;
  }>;
}
export type VCIDDocPerson = AtomicVCV1<VCSIDDocPerson>;

//////////////////////////////////////////////////////////////
// Employment/delegation
//////////////////////////////////////////////////////////////
export interface IncorporationCredential {
  '@type': 'IncorporationCredential';
  credentialCategory?: string;
  additionalType?: string;
  dateCreated?: string;
  datePublished?: string;
  recognizedBy?: MaybeArray<GovernmentOrg>;
}
export interface OrganizationE extends Subject<Organization> {
  '@type': 'Organization';
  name?: string;
  address?: MaybeArray<PostalAddress>;
  legalName?: string;
  dissolutionDate?: string;
  hasCredential?: MaybeArray<IncorporationCredential>;
  telephone?: string;
  faxNumber?: string;
  email?: string;
  website?: MaybeArray<WebSite>;
}
export interface EmployeeRoleOrganization {
  '@type': 'EmployeeRole';
  employeeOf: OrganizationE;
}
export interface EmployeeRolePerson {
  '@type': 'EmployeeRole';
  employee: Person;
}
export interface VCSEmploymentPerson extends Subject<Person> {
  '@type': 'Person';
  employeeOf: MaybeArray<EmployeeRoleOrganization>;
}
export type VCSEmploymentOrganization = OrganizationE & {
  employee: MaybeArray<EmployeeRolePerson>;
};
export type VCEmploymentPerson = AtomicVCV1<VCSEmploymentPerson>;
export type VCEmploymentOrganization = AtomicVCV1<VCSEmploymentOrganization>;

//////////////////////////////////////////////////////////////
// SSN/National ID number
//////////////////////////////////////////////////////////////
export interface VCSNatIDNumPerson extends Subject<Person> {
  '@type': 'Person';
  location: {
    '@type': 'Role';
    location: GovernmentOrg;
    identifier: {
      '@type': 'PropertyValue';
      propertyID: string;
      value: string | number;
    };
  };
}
export interface VCSNatIDNumOrganization extends Subject<Organization> {
  '@type': 'Organization';
  nationality: {
    '@type': 'Role';
    nationality: GovernmentOrg;
    identifier: {
      '@type': 'PropertyValue';
      propertyID: string;
      value: string | number;
    };
  };
}
export type VCNatIDNumPerson = AtomicVCV1<VCSNatIDNumPerson>;
export type VCNatIDNumOrganization = AtomicVCV1<VCSNatIDNumOrganization>;

//////////////////////////////////////////////////////////////
// Address
//////////////////////////////////////////////////////////////
export interface VCSAddressPerson extends Subject<Person> {
  '@type': 'Person';
  address: MaybeArray<PostalAddress>;
}
export interface VCSAddressOrganization extends Subject<Organization> {
  '@type': 'Organization';
  address: MaybeArray<PostalAddress>;
}
export type VCAddressPerson = AtomicVCV1<VCSAddressPerson>;
export type VCAddressOrganization = AtomicVCV1<VCSAddressOrganization>;

//////////////////////////////////////////////////////////////
// Birthdate/DOB
//////////////////////////////////////////////////////////////
export interface VCSDOBPerson extends Subject<Person> {
  '@type': 'Person';
  birthDate: string;
}
export type VCDOBPerson = AtomicVCV1<VCSDOBPerson>;

//////////////////////////////////////////////////////////////
// Gender
//////////////////////////////////////////////////////////////
export interface VCSGenderPerson extends Subject<Person> {
  '@type': 'Person';
  gender: MaybeArray<GenderType | string>;
}
export type VCGenderPerson = AtomicVCV1<VCSGenderPerson>;

//////////////////////////////////////////////////////////////
// Accounts and assets
//////////////////////////////////////////////////////////////
export interface MonetaryAmountR extends MonetaryAmount {
  currency: string;
  value: number | string;
}
export interface AccountStatement {
  statementDate?: string;
  dueDate?: string;
}
export interface AccountPayment {
  paymentDate?: string;
  amount: MonetaryAmountR;
}
export interface ServiceAccountStatement extends AccountStatement {
  balanceAdjustments?: number;
  totalBill?: MonetaryAmountR;
  serviceAddress?: PostalAddress;
  billingAddress?: PostalAddress;
}
export interface BankAccountStatement extends AccountStatement {
  balanceAdjustments?: number;
  totalBill?: MonetaryAmountR;
  serviceAddress?: PostalAddress;
  billingAddress?: PostalAddress;
}
export interface BankAccountTransaction {
  transactionType: 'credit' | 'debit';
  value: MonetaryAmountR;
  memo?: string;
}
export interface BankAccountTransactionGroup {
  identifier?: number;
  startDate?: string;
  endDate?: string;
  cashflowCategory?: string;
  cashflowSubcategory?: string;
  payrollAgency?: boolean;
  memo?: string;
  length?: number; // Length in days
  payee?: string;
  payer?: string;
  rank?: string;
  frequency?: string; // 'daily', 'weekly', 'biweekly', 'monthly', 'semiMonthly', 'annually', 'irregular', ...
  periodicity?: number;
  valueStddev?: MonetaryAmount;
  valueTotal?: MonetaryAmount;
  valueMean?: MonetaryAmount;
  valueMedian?: MonetaryAmount;
  transactions?: MaybeArray<BankAccountTransaction>;
}
export interface Account {
  '@type': 'Account';
  identifier?: string | number;
  organization: {
    '@type': 'Organization';
    name?: string;
    identifier?: string | number;
    serviceTypes?: Array<string>;
    nationality?: GovernmentOrg;
    sameAs?: string; // Website
  };
  startDate?: string;
  endDate?: string;
  accountType?: string;
  accountTypeConfidence?: number;
  accountStatements?: Array<AccountStatement>;
  accountPayments?: Array<AccountPayment>;
  value?: MonetaryAmountR;
  bankAccountCategory?: string;
  hasIncome?: MaybeArray<BankAccountTransactionGroup>;
  hasExpense?: MaybeArray<BankAccountTransactionGroup>;
  hasTransactions?: MaybeArray<BankAccountTransaction>;
}
export interface VCSAccountPerson extends Subject<Person> {
  '@type': 'Person';
  hasAccount: MaybeArray<Account>;
}
export interface VCSAccountOrganization extends Subject<Organization> {
  '@type': 'Organization';
  hasAccount: MaybeArray<Account>;
}
export type VCAccountPerson = AtomicVCV1<VCSAccountPerson>;
export type VCAccountOrganization = AtomicVCV1<VCSAccountOrganization>;

//////////////////////////////////////////////////////////////
// Credit score
//////////////////////////////////////////////////////////////
export interface TradelinePayStatus {
  date: string;
  status: string;
}
export interface TradelineRemark {
  remark: string;
  remarkCode: string;
}
export interface Tradeline {
  '@type': 'Tradeline';
  accountType?: string;
  accountNumber?: string | number;
  creditType?: string;
  balanceCurrent?: MonetaryAmountR;
  balanceMax?: MonetaryAmountR;
  balancePercentage?: number;
  rating?: string;
  open?: boolean;
  statement?: string;

  subscriberCode?: string;
  verifiedDate?: string;
  reportedDate?: string;
  openedDate?: string;
  accountStatusDate?: string;
  closedDate?: string;
  bureau?: string;
  accountCondition?: string;
  accountDesignator?: string;
  disputeFlag?: string;
  industryCode?: string;
  accountIsOpen?: boolean;
  payStatus?: string;
  verificationIndicator?: string;
  remark?: MaybeArray<TradelineRemark>;

  monthsReviewed: string;
  monthlyPayment: string;
  late90Count: string;
  late60Count: string;
  late30Count: string;
  dateLatePayment: string;
  termMonths: string;
  collateral: string;
  amountPastDue: MonetaryAmountR;
  worstPastStatusCount: string;
  paymentFrequency?: string;
  termType?: string;
  worstPayStatus?: string;
  payStatuses: Array<TradelinePayStatus>;
  creditLimit?: string;

  creditor: string | Organization;
  position: string;
}
export interface CreditScore {
  '@type': 'CreditScore';
  score: number;
  scoreType: string;
  populationRank?: number;
  provider?: string;
  lastUpdatedDate?: string;
  utilizationPercentage?: number;
  historyStartDate?: string;
  paymentHistoryPercentage?: number;
  statement?: string;
  tradelines?: Array<Tradeline>;

  // Snapshot data
  creditDataSuppressed: string;
  totalAccounts: string;
  totalClosedAccounts: string;
  delinquentAccounts: string;
  derogatoryAccounts: string;
  openAccounts: string;
  totalBalances: string;
  totalMonthlyPayments: string;
  numberOfInquiries: string;
  totalPublicRecords: string;
  recentInquiries: string;
  balanceOpenRevolvingAccounts: string;
  totalOpenRevolvingAccounts: string;
  balanceOpenInstallmentAccounts: string;
  totalOpenInstallmentAccounts: string;
  balanceOpenMortgageAccounts: string;
  totalOpenMortgageAccounts: string;
  balanceOpenCollectionAccounts: string;
  totalOpenCollectionAccounts: string;
  balanceOpenOtherAccounts: string;
  totalOpenOtherAccounts: string;
  availableCredit: string;
  utilization: string;
  onTimePaymentPercentage: string;
  latePaymentPercentage: string;
  recentTradelinesOpened: string;
  dateOfOldestTrade: string;
  ageOfCredit: string;
  paymentHistory: string;
  securityFreeze: string;
  fraudAlert: string;
}
export interface VCSCreditScorePerson extends Subject<Person> {
  '@type': 'Person';
  birthDate?: string;
  name?: string;
  employeeOf?: EmployeeRoleOrganization;
  hasCreditScore: MaybeArray<CreditScore>;
}
export type VCCreditScorePerson = AtomicVCV1<VCSCreditScorePerson>;

//////////////////////////////////////////////////////////////
// Meta/aggregation
//////////////////////////////////////////////////////////////
export interface ReceivedCredentialRole {
  '@type': 'ReceivedCredentialRole';
  startDate?: string;
  endDate?: string;
  aggregator?: string;
  contextsSome?: Array<string>;
  contextsAll?: Array<string>;
  contextsNot?: Array<string>;
  reporterDidSome?: Array<string>;
  reporterDidAll?: Array<string>;
  reporterDidNot?: Array<string>;
  receivedCredentials: MaybeArray<string | AtomicVCV1>;
}
export interface VCSMetaPerson extends Subject<Person> {
  '@type': 'Person';
  receivedCredentials: MaybeArray<ReceivedCredentialRole>;
}
export interface VCSMetaOrganization extends Subject<Organization> {
  '@type': 'Organization';
  receivedCredentials: MaybeArray<ReceivedCredentialRole>;
}
export type VCMetaPerson = AtomicVCV1<VCSMetaPerson>;
export type VCMetaOrganization = AtomicVCV1<VCSMetaOrganization>;

/**
 * +--------- Table of implemented attestation types -----------+
 *
 * Key:
 * +------------------------------------------------------------+
 * | X | Attestations completed in this document                |
 * | M | Missing                                                |
 * | D | Deprecated attestations                                |
 * | - | Attestations without a known production implementation |
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
