import {BaseVCV1} from '../../types/vc/shared/v1'

// Base types
export type TLangString = {value: string; lang: string}

// credentialSubject types

export type TCSEntity = {
  id: string
  entity: {
    businessId: string
    type: string
    state: string
    //example of how to address multiple languages like pinyin and chinese
    name: Array<TLangString>
    address: Array<TLangString>
    registrationDate: string
    expirationDate: string
    registrationAuthority: string //ACRA in Singapore
    telephone: string
    fax: string
    email: string
    website: string
    aliases: {
      type: string
    }
  }
  //registrationchanges for CN and registered activities for Singapore
  registrationEvents: Array<{
    event: string
    type: string
    date: string
  }>
  representative: Array<{
    name: string
    identityID: string
    identityType: string
    type: string
  }>
  bankruptcy: Array<{
    caseId: string
    caseType: string
    date: string
    status: string
  }>
  legalRecords: {}
}

export type TCEntity = BaseVCV1<TCSEntity>
