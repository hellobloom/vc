import Web3 from 'web3'

import AttestationLogicABI from './AttestationLogicABI'

const abiDecoder = require('abi-decoder')

abiDecoder.addABI(AttestationLogicABI)

export type IDecodedLogEvent = {
  name: string
  type: string
  value: string
}

export type TDecodedLog = {
  address: string
  name: string
  events: IDecodedLogEvent[]
}

export const getDecodedTxEventLogs = async (provider: string, txHash: string): Promise<TDecodedLog[]> => {
  const web3 = new Web3(new Web3.providers.HttpProvider(provider))
  const txReceipt = await web3.eth.getTransactionReceipt(txHash)
  if (!txReceipt) {
    throw Error(`Unable to retrieve transaction receipt for hash: '${txHash}'`)
  }
  return abiDecoder.decodeLogs(txReceipt.logs) as TDecodedLog[]
}

export const getDecodedLogValueByName = (decodedLog: TDecodedLog, name: string): string | undefined => {
  const event = decodedLog.events.find(e => e.name === name)
  return event && event.value
}
