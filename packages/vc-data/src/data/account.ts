import {VCV1} from '@bloomprotocol/vc-common'
import {Subject, MaybeArray, GovernmentOrg, MonetaryAmountR} from './base'
import {Person, Organization, PostalAddress} from 'schema-dts'

//////////////////////////////////////////////////////////////
// Accounts and assets
//////////////////////////////////////////////////////////////
export type AccountStatement = {
  '@type': 'AccountStatement'
  statementDate?: string
  dueDate?: string
}
export type AccountPayment = {
  '@type': 'AccountPayment'
  paymentDate?: string
  amount: MonetaryAmountR
}
export type ServiceAccountStatement = AccountStatement & {
  balanceAdjustments?: MonetaryAmountR
  totalBill?: MonetaryAmountR
  serviceAddress?: PostalAddress
  billingAddress?: PostalAddress
}
export type BankAccountTransaction = {
  '@type': 'BankAccountTransaction'
  transactionType: 'credit' | 'debit'
  value: MonetaryAmountR
  memo?: string
}
export type BankAccountTransactionGroup = {
  '@type': 'BankAccountTransactionGroup'
  identifier?: number
  startDate?: string
  endDate?: string
  cashflowCategory?: string
  cashflowSubcategory?: string
  payrollAgency?: boolean
  memo?: string
  length?: number // Length in days
  payee?: string
  payer?: string
  rank?: string
  frequency?: string // 'daily', 'weekly', 'biweekly', 'monthly', 'semiMonthly', 'annually', 'irregular', ...
  periodicity?: number
  valueStddev?: MonetaryAmountR
  valueTotal?: MonetaryAmountR
  valueMean?: MonetaryAmountR
  valueMedian?: MonetaryAmountR
  transactions?: MaybeArray<BankAccountTransaction>
}

export type OrganizationAccount = Organization & {
  name?: string
  identifier?: string | number
  serviceTypes?: Array<string>
  nationality?: GovernmentOrg
  sameAs?: string // Website
}
export type Account = {
  '@type': 'Account'
  identifier?: string | number
  organization: OrganizationAccount
  startDate?: string
  endDate?: string
  accountType?: string
  accountTypeConfidence?: number
  accountStatements?: Array<AccountStatement>
  accountPayments?: Array<AccountPayment>
  value?: MonetaryAmountR
  bankAccountCategory?: string
  hasIncome?: MaybeArray<BankAccountTransactionGroup>
  hasExpense?: MaybeArray<BankAccountTransactionGroup>
  hasTransactions?: MaybeArray<BankAccountTransaction>
}
export type VCSAccountPerson = Subject<
  Person & {
    hasAccount: MaybeArray<Account>
  }
>
export type VCSAccountOrganization = Subject<
  Organization & {
    hasAccount: MaybeArray<Account>
  }
>
export type VCAccountPerson = VCV1<VCSAccountPerson>
export type VCAccountOrganization = VCV1<VCSAccountOrganization>
