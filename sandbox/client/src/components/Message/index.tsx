import React from 'react'
import {FC, forwardProps} from 'react-forward-props'
import clsx from 'clsx'

type TMessageSkins = 'default' | 'dark' | 'primary' | 'link' | 'info' | 'success' | 'warning' | 'danger'

type TMessageSkinConfig = {
  className: string
}

const MessageSkin: {[K in TMessageSkins]: TMessageSkinConfig} = {
  default: {className: ''},
  dark: {className: 'is-dark'},
  primary: {className: 'is-primary'},
  link: {className: 'is-link'},
  info: {className: 'is-info'},
  success: {className: 'is-success'},
  warning: {className: 'is-warning'},
  danger: {className: 'is-danger'},
}

type MessageProps = {
  skin?: TMessageSkinConfig
}

const Message: FC<'article', MessageProps> = _props => {
  const props = {skin: MessageSkin.default, ..._props}

  return (
    <article {...forwardProps(props, 'skin')} className={clsx('message', props.skin.className, props.className)}>
      {props.children}
    </article>
  )
}

type MessageHeaderProps = {}

const MessageHeader: FC<'div', MessageHeaderProps> = props => (
  <div {...props} className={clsx('message-header', props.className)}>
    {props.children}
  </div>
)

type MessageBodyProps = {}

const MessageBody: FC<'div', MessageBodyProps> = props => (
  <div {...props} className={clsx('message-body', props.className)}>
    {props.children}
  </div>
)

export {Message, MessageSkin, MessageHeader, MessageBody}
