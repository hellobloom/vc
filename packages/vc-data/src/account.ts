import { AtomicVCV1 } from '@bloomprotocol/vc-common';
import { Subject, MaybeArray, GovernmentOrg, MonetaryAmountR } from './base';
import { Person, Organization, PostalAddress } from 'schema-dts';

//////////////////////////////////////////////////////////////
// Accounts and assets
//////////////////////////////////////////////////////////////
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
  valueStddev?: MonetaryAmountR;
  valueTotal?: MonetaryAmountR;
  valueMean?: MonetaryAmountR;
  valueMedian?: MonetaryAmountR;
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
