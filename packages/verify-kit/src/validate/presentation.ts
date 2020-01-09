import {
  IVerifiedDataLegacy,
  IVerifiedDataOnChain,
  VerifiedData,
  IVerifiablePresentation,
  DataVersions,
} from '@bloomprotocol/attestations-common'

import {getDecodedTxEventLogs, getDecodedLogValueByName, TDecodedLog} from '../txUtils'
import {validateVerifiablePresentation} from './structure/presentation'
import {ValidationResponse, ValidationError} from './utils'

type OnChain = {
  validateOnChain: true
  web3Provider: string
}

type OffChain = {
  validateOnChain: false
}

type ChainOptions = OnChain | OffChain

type ValidateVerifiablePresentationResponse = ChainOptions

type RetrieveTxDataOutput = {
  logs: TDecodedLog[]
  errors: ValidationError[]
}

const retreiveTxData = async (
  payloadData: IVerifiedDataLegacy | IVerifiedDataOnChain,
  web3Provider: string,
): Promise<RetrieveTxDataOutput> => {
  const txHash = payloadData.tx
  let logs: TDecodedLog[] = []
  const errors: ValidationError[] = []
  if (txHash === null || txHash === '' || txHash === '0x') {
    errors.push({
      key: 'tx',
      message: `tx is missing in payload for node with hash ${payloadData.layer2Hash}`,
    })
  } else {
    try {
      logs = await getDecodedTxEventLogs(web3Provider, txHash)
    } catch (err) {
      errors.push({
        key: 'getDecodedLogsFailed',
        message: `${err}`,
      })
    }
  }
  return {
    logs,
    errors,
  }
}

const validateOnChainProperties = (subject: string, payloadData: VerifiedData, logs: TDecodedLog[]): ValidationError[] => {
  const errors: ValidationError[] = []
  // verify subject shared dataHash matches chain by using it as a part of the find logic
  const matchingTraitAttestedLogs =
    logs && logs.find(l => l.name === 'TraitAttested' && getDecodedLogValueByName(l, 'dataHash') === payloadData.layer2Hash)
  if (!matchingTraitAttestedLogs) {
    errors.push({
      key: 'TraitAttested',
      message: "Unable to find 'TraitAttested' event logs with a" + ` 'dataHash' of '${payloadData.layer2Hash}'.`,
    })
    return errors
  }

  // verify shared subject address matches chain
  const onChainSubjectAddress = getDecodedLogValueByName(matchingTraitAttestedLogs, 'subject')
  if (subject !== onChainSubjectAddress) {
    errors.push({
      key: 'subject',
      message:
        'The on chain subject address does not match what was shared.' +
        `\nShared subject address: '${subject}'` +
        `\nOn chain subject address: '${onChainSubjectAddress}'`,
    })
  }

  // verify shared attester address matches chain
  const onChainAttesterAddress = getDecodedLogValueByName(matchingTraitAttestedLogs, 'attester')
  if (payloadData.attester !== onChainAttesterAddress) {
    errors.push({
      key: 'attester',
      message:
        'The on chain attester address does not match what was shared.' +
        `\nShared attester address: '${payloadData.attester}'` +
        `\nOn chain attester address: '${onChainAttesterAddress}'`,
    })
  }

  return errors
}

export const validateVerifiablePresentationResponse = async (
  data: any,
  options: ValidateVerifiablePresentationResponse = {validateOnChain: false},
): Promise<ValidationResponse<IVerifiablePresentation>> => {
  const outcome = validateVerifiablePresentation(data)

  if (outcome.kind === 'invalid_param') {
    return {
      kind: 'invalid',
      errors: [{key: outcome.kind, message: outcome.message}],
    }
  }

  const errors: ValidationError[] = []
  const logs: TDecodedLog[] = []

  if (options.validateOnChain) {
    await Promise.all(
      outcome.data.verifiableCredential.map(async d => {
        // Verify the on-chain data integrity
        switch (d.proof.data.version) {
          case DataVersions.legacy:
          case DataVersions.onChain:
            try {
              const {errors: txErrors, logs: txLogs} = await retreiveTxData(d.proof.data, options.web3Provider)

              errors.concat(...[txErrors, validateOnChainProperties(d.credentialSubject.subject, d.proof.data, txLogs)])
              logs.concat(txLogs)
            } catch (err) {
              errors.push({
                key: 'onChainValidationFailed',
                message: `Failed to validate on chain data integrity for node with hash ${d.proof.data.layer2Hash}`,
              })
            }
            break
          case DataVersions.batch:
            break
          default:
            break
        }
      }),
    )
  }

  if (errors.length > 0) {
    return {
      kind: 'invalid',
      errors,
    }
  }

  return {
    kind: 'validated',
    data: outcome.data,
  }
}
