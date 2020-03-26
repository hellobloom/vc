---
id: account
title: Account VCs
hide_title: false
---

![Account VCs]

The types related to `Account` encapsulate any account linking a person or organization to an organization.  Examples may include a website account, bank account, utility account, or similar.


## Utility types

### AccountStatement

A statement for an account.

| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'AccountStatement' | true |  |
| statementDate |  string | false |  |
| dueDate |  string | false |  |

### AccountPayment

A payment for an account.

| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'AccountPayment' | true |  |
| paymentDate |  string | false |  |
| amount |  MonetaryAmountR | true |  |

### ServiceAccountStatement

Extensions to `AccountStatement` for service accounts.

| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| balanceAdjustments |  number | false |  |
| totalBill |  MonetaryAmountR | false |  |
| serviceAddress |  PostalAddress | false |  |
| billingAddress |  PostalAddress | false |  |

### BankAccountTransaction

A transaction (debit or credit) against a bank account.

| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'BankAccountTransaction' | true |  |
| transactionType |  'credit' or 'debit' | true |  |
| value |  MonetaryAmountR | true |  |
| memo |  string | false |  |

### BankAccountTransactionGroup

A group of transactions for a bank account, useful for analysis of income/expenditure streams over time.

| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'BankAccountTransactionGroup' | true |  |
| identifier |  number | false |  |
| startDate |  string | false |  |
| endDate |  string | false |  |
| cashflowCategory |  string | false |  |
| cashflowSubcategory |  string | false |  |
| payrollAgency |  boolean | false |  |
| memo |  string | false |  |
| length |  number  | false |  Length in days |
| payee |  string | false |  |
| payer |  string | false |  |
| rank |  string | false |  |
| frequency |  string  | false |  'daily', 'weekly', 'biweekly', 'monthly', 'semiMonthly', 'annually', 'irregular', ... |
| periodicity |  number | false |  |
| valueStddev |  MonetaryAmountR | false |  |
| valueTotal |  MonetaryAmountR | false |  |
| valueMean |  MonetaryAmountR | false |  |
| valueMedian |  MonetaryAmountR | false |  |
| transactions |  MaybeArray&lt;BankAccountTransaction&gt; | false |  |


### OrganizationAccount

Extensions/suggestions regarding the base schema.org `Organization` type for the purpose of account ownership.  `nationality` and `serviceTypes` are non-standard attributes.

| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'Organization' | true |  |
| name |  string | false |  |
| identifier |  string or number | false |  |
| serviceTypes |  Array&lt;string&gt; | false |  |
| nationality |  GovernmentOrg | false |  |
| sameAs |  string  | false |  Website |

### Account

Custom type for encapsulating the concept of an account - ostensibly a relation between an institution and either an individual or another institution.  This type is highly generalized to promote use to describe any type of account.

| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'Account' | true |  |
| identifier |  string or number | false |  |
| organization |  OrganizationAccount | true |  |
| startDate |  string | false |  |
| endDate |  string | false |  |
| accountType |  string | false |  |
| accountTypeConfidence |  number | false |  |
| accountStatements |  Array&lt;AccountStatement&gt; | false |  |
| accountPayments |  Array&lt;AccountPayment&gt; | false |  |
| value |  MonetaryAmountR | false |  |
| bankAccountCategory |  string | false |  |
| hasIncome |  MaybeArray&lt;BankAccountTransactionGroup&gt; | false |  |
| hasExpense |  MaybeArray&lt;BankAccountTransactionGroup&gt; | false |  |
| hasTransactions |  MaybeArray&lt;BankAccountTransaction&gt; | false |  |

### VCSAccountPerson

credentialSubject type relating a `Person` to an `Account`.  

| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'Person' | true |  |
| hasAccount |  MaybeArray&lt;Account&gt; | true |  |

### VCSAccountOrganization

credentialSubject type relating an `Organization` to an `Account`.  

| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'Organization' | true |  |
| hasAccount |  MaybeArray&lt;Account&gt; | true |  |

### VCAccountPerson

Type expanding VCSAccountPerson credentialSubject into a VC.

### VCAccountOrganization

Type expanding VCSAccountOrganization credentialSubject into a VC.

