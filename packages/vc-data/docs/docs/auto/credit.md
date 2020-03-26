---
id: credit
title: Credit VCs
hide_title: false
---

|  |  | true |  |
|  |  | true |  Credit score |
|  |  | true |  |

### TradelinePayStatus
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| date |  string | true |  |
| status |  string | true |  |

### TradelineRemark
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| remark |  string | true |  |
| remarkCode |  string | true |  |

### Tradeline
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'Tradeline' | true |  |
| accountType |  string | false |  |
| accountNumber |  string or number | false |  |
| creditType |  string | false |  |
| balanceCurrent |  MonetaryAmountR | false |  |
| balanceMax |  MonetaryAmountR | false |  |
| balancePercentage |  number | false |  |
| rating |  string | false |  |
| open |  boolean | false |  |
| statement |  string | false |  |

| subscriberCode |  string | false |  |
| verifiedDate |  string | false |  |
| reportedDate |  string | false |  |
| openedDate |  string | false |  |
| accountStatusDate |  string | false |  |
| closedDate |  string | false |  |
| bureau |  string | false |  |
| accountCondition |  string | false |  |
| accountDesignator |  string | false |  |
| disputeFlag |  string | false |  |
| industryCode |  string | false |  |
| accountIsOpen |  boolean | false |  |
| payStatus |  string | false |  |
| verificationIndicator |  string | false |  |
| remark |  MaybeArray<TradelineRemark> | false |  |

| monthsReviewed |  string | false |  |
| monthlyPayment |  string | false |  |
| late90Count |  string | false |  |
| late60Count |  string | false |  |
| late30Count |  string | false |  |
| dateLatePayment |  string | false |  |
| termMonths |  string | false |  |
| collateral |  string | false |  |
| amountPastDue |  MonetaryAmountR | false |  |
| worstPastStatusCount |  string | false |  |
| paymentFrequency |  string | false |  |
| termType |  string | false |  |
| worstPayStatus |  string | false |  |
| payStatuses |  Array<TradelinePayStatus> | false |  |
| creditLimit |  string | false |  |

| creditor |  string or Organization | false |  |
| position |  string | false |  |

### CreditScore
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'CreditScore' | true |  |
| score |  number | false |  |
| scoreType |  string | false |  |
| populationRank |  number | false |  |
| provider |  string | false |  |
| lastUpdatedDate |  string | false |  |
| utilizationPercentage |  number | false |  |
| historyStartDate |  string | false |  |
| paymentHistoryPercentage |  number | false |  |
| statement |  string | false |  |
| tradelines |  Array<Tradeline> | false |  |

|  |    | true |  Snapshot data |
| creditDataSuppressed |  string | false |  |
| totalAccounts |  string | false |  |
| totalClosedAccounts |  string | false |  |
| delinquentAccounts |  string | false |  |
| derogatoryAccounts |  string | false |  |
| openAccounts |  string | false |  |
| totalBalances |  string | false |  |
| totalMonthlyPayments |  string | false |  |
| numberOfInquiries |  string | false |  |
| totalPublicRecords |  string | false |  |
| recentInquiries |  string | false |  |
| balanceOpenRevolvingAccounts |  string | false |  |
| totalOpenRevolvingAccounts |  string | false |  |
| balanceOpenInstallmentAccounts |  string | false |  |
| totalOpenInstallmentAccounts |  string | false |  |
| balanceOpenMortgageAccounts |  string | false |  |
| totalOpenMortgageAccounts |  string | false |  |
| balanceOpenCollectionAccounts |  string | false |  |
| totalOpenCollectionAccounts |  string | false |  |
| balanceOpenOtherAccounts |  string | false |  |
| totalOpenOtherAccounts |  string | false |  |
| availableCredit |  string | false |  |
| utilization |  string | false |  |
| onTimePaymentPercentage |  string | false |  |
| latePaymentPercentage |  string | false |  |
| recentTradelinesOpened |  string | false |  |
| dateOfOldestTrade |  string | false |  |
| ageOfCredit |  string | false |  |
| paymentHistory |  string | false |  |
| securityFreeze |  string | false |  |
| fraudAlert |  string | false |  |

### VCSCreditScorePerson
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
| @type |  'Person' | true |  |
| birthDate |  string | false |  |
| name |  string | false |  |
| employeeOf |  EmployeeRoleOrganization | false |  |
| hasCreditScore |  MaybeArray<CreditScore> | true |  |

### VCCreditScorePerson
| Attribute | Type | Required | Notes |
| ---       | ---   | ---       | --- |
