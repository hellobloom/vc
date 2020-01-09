import * as B from './base'
import {TAddress, IBaseAttAddress, IBaseAttAddressProvider} from '../AttestationData'

export const fields: Array<keyof TAddress> = [
  'full',
  'name',
  'street_1',
  'street_2',
  'street_3',
  'city',
  'postal_code',
  'region_1',
  'region_2',
  'country',
]

export const extractAddress = (a: IBaseAttAddress, valType: string): IBaseAttAddressProvider | TAddress | string | number | null => {
  // Get first provider
  const providerBlock: IBaseAttAddressProvider | null = B.getFirst(a.data)
  if (providerBlock) {
    if (valType === 'object') {
      return providerBlock
    }
    if (typeof providerBlock.address !== 'object') {
      return null
    }
    const address: TAddress | null = providerBlock.address instanceof Array ? B.getFirst(providerBlock.address) : providerBlock.address
    const provider = providerBlock.provider
    if (valType === 'address') {
      return address
    } else if (address && typeof address === 'object' && valType in address) {
      const val = address[valType as keyof TAddress]
      if (typeof val === 'undefined') {
        return null
      }
      return val
    } else if (provider && typeof provider === 'object' && (valType === 'provider.name' || valType in provider)) {
      if (valType === 'provider.name') {
        return provider.name
      }
      const val = provider[valType as keyof IBaseAttAddressProvider['provider']]
      if (typeof val === 'undefined') {
        return null
      }
      return val
    }
  }
  return null
}
