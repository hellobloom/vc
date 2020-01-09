import React from 'react'
import PropTypes from 'prop-types'
import {View} from 'react-native'

export default function CenterView({children}) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
      }}
    >
      <View style={{width: '90%', flexWrap: 'wrap', alignItems: 'center'}}>{children}</View>
    </View>
  )
}

CenterView.defaultProps = {
  children: null,
}

CenterView.propTypes = {
  children: PropTypes.node,
}
