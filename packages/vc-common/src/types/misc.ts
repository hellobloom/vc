export interface IMerkleProofShare {
  position: 'left' | 'right'
  data: string
}

export interface IProof {
  position: 'left' | 'right'
  data: Buffer
}

export type Stage = 'mainnet' | 'rinkeby' | 'ropsten' | 'local'

export enum ChainId {
  Main = 1,
  Rinkeby = 4,
}

export interface ITypedDataParam {
  name: string
  type: string
}

export interface IFormattedTypedData {
  types: {
    EIP712Domain: ITypedDataParam[]
    [key: string]: ITypedDataParam[]
  }
  primaryType: string
  domain: {
    name: string
    version: string
    chainId: number
    verifyingContract: string
  }
  message: {[key: string]: string}
}
