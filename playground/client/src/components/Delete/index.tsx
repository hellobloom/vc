import React from 'react'
import {FC, forwardProps} from 'react-forward-props'
import clsx from 'clsx'

type TDeleteSizes = 'small' | 'default' | 'medium' | 'large'

type TDeleteSizeConfig = {
  className: string
}

export const DeleteSize: {[K in TDeleteSizes]: TDeleteSizeConfig} = {
  default: {className: ''},
  small: {className: 'is-small'},
  medium: {className: 'is-medium'},
  large: {className: 'is-large'},
}

type DeleteProps = {
  size?: TDeleteSizeConfig
}

export const Delete: FC<'button', DeleteProps> = _props => {
  const props = {size: DeleteSize.default, ..._props}

  return (
    <button {...forwardProps(props, 'size')} className={clsx('delete', props.size.className, props.className)}>
      {props.children}
    </button>
  )
}
