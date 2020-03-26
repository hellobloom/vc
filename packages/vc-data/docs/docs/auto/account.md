---
id: account
title: Account VCs
hide_title: false
---

|  |  | true |  |
|  |  | true |  Accounts and assets |
|  |  | true |  |

### AccountStatement
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'AccountStatement' | true |  |
| statementDate |  string | false |  |
| dueDate |  string | false |  |

### AccountPayment
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'AccountPayment' | true |  |
| paymentDate |  string | false |  |
| amount |  MonetaryAmountR | true |  |

### ServiceAccountStatement
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| balanceAdjustments |  MonetaryAmountR | false |  |
| totalBill |  MonetaryAmountR | false |  |
| serviceAddress |  PostalAddress | false |  |
| billingAddress |  PostalAddress | false |  |

### BankAccountTransaction
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'BankAccountTransaction' | true |  |
| transactionType |  'credit' or 'debit' | true |  |
| value |  MonetaryAmountR | true |  |
| memo |  string | false |  |

### BankAccountTransactionGroup
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
| transactions |  MaybeArray<BankAccountTransaction> | false |  |


### OrganizationAccount
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'Organization' | true |  |
| name |  string | false |  |
| identifier |  string or number | false |  |
| serviceTypes |  Array<string> | false |  |
| nationality |  GovernmentOrg | false |  |
| sameAs |  string  | false |  Website |

### Account
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'Account' | true |  |
| identifier |  string or number | false |  |
| organization |  OrganizationAccount | true |  |
| startDate |  string | false |  |
| endDate |  string | false |  |
| accountType |  string | false |  |
| accountTypeConfidence |  number | false |  |
| accountStatements |  Array<AccountStatement> | false |  |
| accountPayments |  Array<AccountPayment> | false |  |
| value |  MonetaryAmountR | false |  |
| bankAccountCategory |  string | false |  |
| hasIncome |  MaybeArray<BankAccountTransactionGroup> | false |  |
| hasExpense |  MaybeArray<BankAccountTransactionGroup> | false |  |
| hasTransactions |  MaybeArray<BankAccountTransaction> | false |  |

### VCSAccountPerson
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'Person' | true |  |
| hasAccount |  MaybeArray<Account> | true |  |

### VCSAccountOrganization
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'Organization' | true |  |
| hasAccount |  MaybeArray<Account> | true |  |

### VCAccountPerson
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |

### VCAccountOrganization
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
