import React from 'react'
import {View} from 'react-native'
import {SmallButtonType} from '@bloomprotocol/share-kit'

import {BloomLogo} from './BloomLogo'

type SmallProps = {
  type: SmallButtonType
  invert?: boolean
}

const Small: React.FC<SmallProps> = props => {
  const backgroundColor = props.invert ? '#fff' : '#6262F6'
  const logoFill = props.invert ? '#6262F6' : '#fff'

  let borderRadius: number

  switch (props.type) {
    case 'circle':
      borderRadius = 17
      break
    case 'squircle':
      borderRadius = 8
      break
    case 'rounded-square':
      borderRadius = 4
      break
    case 'square':
      borderRadius = 0
      break
    default:
      throw new Error(`Unsupported type: ${props.type}`)
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 34,
        width: 34,
        borderRadius,
        backgroundColor,
      }}
    >
      <BloomLogo fill={logoFill} size={20} />
    </View>
  )
}

export {Small}
