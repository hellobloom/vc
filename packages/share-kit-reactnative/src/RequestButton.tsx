import React from 'react'
import {Linking, TouchableOpacity} from 'react-native'
import {encode} from 'base-64'
import {RequestData, ButtonOptions} from '@bloomprotocol/share-kit'

import {appendQuery} from './append'
import {Large} from './content/Large'
import {Medium} from './content/Medium'
import {Small} from './content/Small'

type RequestButtonProps = ButtonOptions & {
  requestData: RequestData
}

const RequestButton: React.FC<RequestButtonProps> = props => {
  const appenedRequestData: RequestData = {
    ...props.requestData,
    url: appendQuery(props.requestData.url, {'share-kit-from': 'button'}),
  }

  let content: JSX.Element

  if (props.size === 'sm') {
    content = <Small type={props.type} invert={props.invert} />
  } else if (props.size === 'md') {
    content = <Medium type={props.type || 'verify'} />
  } else {
    content = <Large type={props.type || 'verify'} />
  }

  return (
    <TouchableOpacity
      onPress={() =>
        Linking.openURL(
          `https://bloom.co/download?request=${encode(JSON.stringify(appenedRequestData))}&callback-url=${encodeURIComponent(
            props.callbackUrl,
          )}`,
        )
      }
      activeOpacity={1}
    >
      {content}
    </TouchableOpacity>
  )
}

export {RequestButton}
