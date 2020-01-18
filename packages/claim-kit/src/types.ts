import {Options as QROptions} from '@bloomprotocol/qr'
import Bowser from 'bowser'

type ClaimDataBase = {
  version: number
}

export type ClaimDataV1 = ClaimDataBase & {
  version: 1
  token: string
  url: string
}

export type ClaimData = ClaimDataV1

type ClaimDataPayloadBase = {
  version: number
}

export type ClaimDataPayloadV1 = ClaimDataPayloadBase & {
  version: 1
  org_logo_url: string
  org_name: string
}

export type ClaimDataPayload = ClaimDataPayloadV1

export type SmallButtonType = 'square' | 'rounded-square' | 'circle' | 'squircle'

export type MediumButtonType = 'claim'

export type LargeButtonType = 'claim'

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

export type ClaimElementResult = {
  update: (config: {claimData: ClaimData; buttonOptions: ButtonOptions; qrOptions?: Partial<QROptions>}) => void
  remove: () => void
}
