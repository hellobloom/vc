import {EthUtils, IProof, IMerkleProofShare, IVerifiableCredential} from '@bloomprotocol/att-comms-kit'

export const formatMerkleProofForShare = (proof: IProof[]): IMerkleProofShare[] =>
  proof.map(({position, data}) => ({
    position: position,
    data: '0x' + data.toString('hex'),
  }))

// todo does this make any sense
export const hashCredentials = (credential: IVerifiableCredential[]): string => {
  const credentialProofSorted = credential.map(c => c.proof.data.layer2Hash).sort()
  return EthUtils.hashMessage(JSON.stringify(credentialProofSorted))
}
