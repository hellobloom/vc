import {Options as QROptions} from '@bloomprotocol/qr'
import {TAttestationTypeNames} from '@bloomprotocol/vc-common'
import Bowser from 'bowser'

// Request Types

/**
 * @deprecated
 */
export enum Action {
  attestation = 'request_attestation_data',
  authentication = 'authentication',
}

/**
 * @deprecated
 */
type BaseRequestDataV0 = {
  token: string
  url: string
  org_logo_url: string
  org_name: string
  org_usage_policy_url: string
  org_privacy_policy_url: string
}

/**
 * @deprecated
 */
export type RequestDataAttestationV0 = BaseRequestDataV0 & {
  action: Action.attestation
  types: TAttestationTypeNames[]
}

/**
 * @deprecated
 */
export type RequestDataAuthenticationV0 = BaseRequestDataV0 & {
  action: Action.authentication
}

/**
 * @deprecated
 */
export type RequestDataV0 = RequestDataAttestationV0 | RequestDataAuthenticationV0

type BaseRequestData = {
  version: number
}

export type BaseRequestDataV1 = BaseRequestData & {
  version: 1
  action: string
  responseVersion: number
  token: string
  url: string
  payloadUrl: string
}

export type CredRequestDataV1 = BaseRequestDataV1 & {
  version: 1
  responseVersion: 1
  action: 'credential'
}

export type AuthRequestDataV1 = BaseRequestDataV1 & {
  version: 1
  responseVersion: 0
  action: 'authentication'
}

export type RequestDataV1 = CredRequestDataV1 | AuthRequestDataV1

export type RequestData = RequestDataV0 | RequestDataV1

// Request Payload Types

export type BasePayloadRequestData = {
  version: number
}

export type DetailedCredTypeConfigV1 = {
  name: string
  optional?: boolean
  completedAfter?: string
  completedBefore?: string
  providerWhitelist?: string[]
  providerBlacklist?: string[]
  issuerWhitelist?: string[]
  issuerBlacklist?: string[]
}

export type BaseRequestPayloadDataV1 = BasePayloadRequestData & {
  version: 1
  orgLogoUrl: string
  orgName: string
  orgUsagePolicyUrl: string
  orgPrivacyPolicyUrl: string
}

export type CredRequestPayloadDataV1 = BaseRequestPayloadDataV1 & {
  types: (string | DetailedCredTypeConfigV1)[]
  issuerWhitelist?: string[]
  issuerBlacklist?: string[]
}

export type AuthRequestPayloadDataV1 = BaseRequestPayloadDataV1

export type RequestPayloadDataV1 = CredRequestPayloadDataV1 | AuthRequestPayloadDataV1

export type RequestPayloadData = RequestPayloadDataV1

// Button Types

export type SmallButtonType = 'square' | 'rounded-square' | 'circle' | 'squircle'

export type MediumButtonType = 'log-in' | 'sign-up' | 'connect' | 'bloom' | 'verify'

export type LargeButtonType = 'log-in' | 'sign-up' | 'connect' | 'bloom' | 'verify'

export type ButtonSize = 'sm' | 'md' | 'lg'

export type BaseButtonOptions = {
  callbackUrl: string
  size?: ButtonSize
}

export type SmallButtonOptions = BaseButtonOptions & {
  size: 'sm'
  type: SmallButtonType
  invert?: boolean
}

export type MediumButtonOptions = BaseButtonOptions & {
  size: 'md'
  type?: MediumButtonType
}

export type LargeButtonOptions = BaseButtonOptions & {
  size?: 'lg'
  type?: LargeButtonType
}

export type ButtonOptions = SmallButtonOptions | MediumButtonOptions | LargeButtonOptions

export type ShouldRenderButton = boolean | ((parsedResult: Bowser.Parser.ParsedResult) => boolean)

export type RequestElementResult = {
  update: (config: {requestData: RequestData; buttonOptions: ButtonOptions; qrOptions?: Partial<QROptions>}) => void
  remove: () => void
}
