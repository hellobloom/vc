import {VCV1} from '@bloomprotocol/vc-common'
import {Subject, MaybeArray, MonetaryAmountR, EmployeeRoleOrganization} from './base'
import {Person, Organization} from 'schema-dts'

//////////////////////////////////////////////////////////////
// Credit score
//////////////////////////////////////////////////////////////
export type TradelinePayStatus = {
  date: string
  status: string
}
export type TradelineRemark = {
  remark: string
  remarkCode: string
}
export type Tradeline = {
  '@type': 'Tradeline'
  accountType?: string
  accountNumber?: string | number
  creditType?: string
  balanceCurrent?: MonetaryAmountR
  balanceMax?: MonetaryAmountR
  balancePercentage?: number
  rating?: string
  open?: boolean
  statement?: string

  subscriberCode?: string
  verifiedDate?: string
  reportedDate?: string
  openedDate?: string
  accountStatusDate?: string
  closedDate?: string
  bureau?: string
  accountCondition?: string
  accountDesignator?: string
  disputeFlag?: string
  industryCode?: string
  accountIsOpen?: boolean
  payStatus?: string
  verificationIndicator?: string
  remark?: MaybeArray<TradelineRemark>

  monthsReviewed?: string
  monthlyPayment?: string
  late90Count?: string
  late60Count?: string
  late30Count?: string
  dateLatePayment?: string
  termMonths?: string
  collateral?: string
  amountPastDue?: MonetaryAmountR
  worstPastStatusCount?: string
  paymentFrequency?: string
  termType?: string
  worstPayStatus?: string
  payStatuses?: Array<TradelinePayStatus>
  creditLimit?: string

  creditor?: string | Organization
  position?: string
}
export type CreditScore = {
  '@type': 'CreditScore'
  score?: number
  scoreType?: string
  populationRank?: number
  provider?: string
  lastUpdatedDate?: string
  utilizationPercentage?: number
  historyStartDate?: string
  paymentHistoryPercentage?: number
  statement?: string
  tradelines?: Array<Tradeline>

  // Snapshot data
  creditDataSuppressed?: string
  totalAccounts?: string
  totalClosedAccounts?: string
  delinquentAccounts?: string
  derogatoryAccounts?: string
  openAccounts?: string
  totalBalances?: string
  totalMonthlyPayments?: string
  numberOfInquiries?: string
  totalPublicRecords?: string
  recentInquiries?: string
  balanceOpenRevolvingAccounts?: string
  totalOpenRevolvingAccounts?: string
  balanceOpenInstallmentAccounts?: string
  totalOpenInstallmentAccounts?: string
  balanceOpenMortgageAccounts?: string
  totalOpenMortgageAccounts?: string
  balanceOpenCollectionAccounts?: string
  totalOpenCollectionAccounts?: string
  balanceOpenOtherAccounts?: string
  totalOpenOtherAccounts?: string
  availableCredit?: string
  utilization?: string
  onTimePaymentPercentage?: string
  latePaymentPercentage?: string
  recentTradelinesOpened?: string
  dateOfOldestTrade?: string
  ageOfCredit?: string
  paymentHistory?: string
  securityFreeze?: string
  fraudAlert?: string
}
export type VCSCreditScorePerson = Subject<
  Person & {
    '@type': 'Person'
    birthDate?: string
    name?: string
    employeeOf?: EmployeeRoleOrganization
    hasCreditScore: MaybeArray<CreditScore>
  }
>
export type VCCreditScorePerson = VCV1<VCSCreditScorePerson>
