import dotenv from 'dotenv'

dotenv.config()

type BaseGetVarConfig = {
  name: string
  required?: boolean
}
type GetStringVarConfig = BaseGetVarConfig & {
  type: 'string'
}
type GetNumberVarConfig = BaseGetVarConfig & {
  type: 'number'
  radix?: number
}
type GetBoolVarConfig = BaseGetVarConfig & {
  type: 'bool'
}
type GetObjectVarConfig = BaseGetVarConfig & {
  type: 'object'
}
type GetEnumVarConfig = BaseGetVarConfig & {
  type: 'enum'
  values: string[]
}

type GetVarConfig = GetStringVarConfig | GetNumberVarConfig | GetBoolVarConfig | GetObjectVarConfig | GetEnumVarConfig

const getVar = (config: GetVarConfig): any => {
  const {name, required, type} = config
  const value = process.env[name]

  if (typeof value === 'undefined') {
    if (required) throw new Error(`Missing env var: ${name}`)
    return undefined
  }

  switch (config.type) {
    case 'string':
      return value
    case 'number':
      const parsed = parseInt(value, config.radix || 10)
      if (Number.isNaN(parsed)) throw new Error(`${name} is not a number`)
      return parsed
    case 'bool':
      const isTrue = ['true', 't', 'yes', 'y'].includes(value.toLowerCase())
      const isFalse = ['false', 'f', 'no', 'n'].includes(value.toLowerCase())

      if (isTrue) return true
      if (isFalse) return false

      throw new Error(`${name} is not a valid bool value: ${value}`)
    case 'object':
      try {
        return JSON.parse(value)
      } catch (e) {
        throw new Error(`Failed to parse ${name}. ${e}`)
      }
    case 'enum':
      if (config.values.includes(value)) return value
      throw new Error(`${name} is not contained in enum values ${config.values}`)
    default:
      throw new Error(`Unsupported type: ${type}`)
  }
}

type EnvConfig = {
  port: number
  host: string
}

export const getEnv = (): EnvConfig => ({
  port: getVar({name: 'PORT', type: 'number', required: true}),
  host: getVar({name: 'HOST', type: 'string'}),
})
