import {TAttestationTypeNames} from '@bloomprotocol/attestations-common'
import {Options as QROptions} from '@bloomprotocol/qr'
import Bowser from 'bowser'

// Request Types

enum Action {
  attestation = 'request_attestation_data',
  authentication = 'authentication',
}

type RequestDataBase<T extends Action> = {
  action: T
  token: string
  url: string
  org_logo_url: string
  org_name: string
  org_usage_policy_url: string
  org_privacy_policy_url: string
}

type RequestDataAttestation = RequestDataBase<Action.attestation> & {types: TAttestationTypeNames[]}

type RequestDataAuthentication = RequestDataBase<Action.authentication>

type RequestData = RequestDataAttestation | RequestDataAuthentication

type SmallButtonType = 'square' | 'rounded-square' | 'circle' | 'squircle'

type MediumButtonType = 'log-in' | 'sign-up' | 'connect' | 'bloom' | 'verify'

type LargeButtonType = 'log-in' | 'sign-up' | 'connect' | 'bloom' | 'verify'

type ButtonSize = 'sm' | 'md' | 'lg'

type BaseButtonOptions = {
  callbackUrl: string
  size?: ButtonSize
}

type SmallButtonOptions = BaseButtonOptions & {
  size: 'sm'
  type: SmallButtonType
  invert?: boolean
}

type MediumButtonOptions = BaseButtonOptions & {
  size: 'md'
  type?: MediumButtonType
}

type LargeButtonOptions = BaseButtonOptions & {
  size?: 'lg'
  type?: LargeButtonType
}

type ButtonOptions = SmallButtonOptions | MediumButtonOptions | LargeButtonOptions

type ShouldRenderButton = (parsedResult: Bowser.Parser.ParsedResult) => boolean

type RequestElementResult = {
  update: (config: {requestData: RequestData; buttonOptions: ButtonOptions; qrOptions?: Partial<QROptions>}) => void
  remove: () => void
}

export {
  Action,
  RequestDataAttestation,
  RequestDataAuthentication,
  RequestData,
  SmallButtonType,
  MediumButtonType,
  LargeButtonType,
  ButtonSize,
  SmallButtonOptions,
  MediumButtonOptions,
  LargeButtonOptions,
  ButtonOptions,
  ShouldRenderButton,
  RequestElementResult,
}
