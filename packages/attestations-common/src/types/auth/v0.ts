export interface IAuthProof {
  // type string describing share kit style proof
  type: string
  // recent timestamp in RFC3339 format
  created: string
  // The Ethereum address of the user sharing their data
  creator: string
  // token challenge from recipient
  nonce: string
  // host of recipient endpoint
  domain: string
}

export interface IVerifiableAuth {
  // TODO context document
  context: string[]
  type: 'VerifiableAuth'
  proof: IAuthProof
  // Signature of keccak256'ed JSON
  signature: string
}
