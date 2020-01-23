import React from 'react'
import {FC, forwardProps} from 'react-forward-props'
import clsx from 'clsx'

type TButtonSkins =
  | 'default'
  | 'white'
  | 'light'
  | 'dark'
  | 'black'
  | 'text'
  | 'primary'
  | 'link'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'

type TButtonSkinConfig = {
  className: string
}

export const ButtonSkin: {[K in TButtonSkins]: TButtonSkinConfig} = {
  default: {className: ''},
  white: {className: 'is-white'},
  light: {className: 'is-light'},
  dark: {className: 'is-dark'},
  black: {className: 'is-black'},
  text: {className: 'is-text'},
  primary: {className: 'is-primary'},
  link: {className: 'is-link'},
  info: {className: 'is-info'},
  success: {className: 'is-success'},
  warning: {className: 'is-warning'},
  danger: {className: 'is-danger'},
}

type TButtonSizes = 'small' | 'default' | 'normal' | 'medium' | 'large'

type TButtonSizeConfig = {
  className: string
}

export const ButtonSize: {[K in TButtonSizes]: TButtonSizeConfig} = {
  default: {className: ''},
  small: {className: 'is-small'},
  normal: {className: 'is-normal'},
  medium: {className: 'is-medium'},
  large: {className: 'is-large'},
}

type ButtonProps = {
  skin?: TButtonSkinConfig
  size?: TButtonSizeConfig
  isLight?: boolean
  isFullwidth?: boolean
  isOutlined?: boolean
  isInverted?: boolean
  isRounded?: boolean
  isHovered?: boolean
  isFocused?: boolean
  isActive?: boolean
  isLoading?: boolean
  isStatic?: boolean
  isDisabled?: boolean
}

export const Button: FC<'button', ButtonProps> = _props => {
  const props = {skin: ButtonSkin.default, size: ButtonSkin.default, ..._props}

  return (
    <button
      {...forwardProps(props, 'skin', 'size', 'isLight', 'isFullwidth', 'isOutlined', 'isInverted', 'isRounded')}
      className={clsx(
        'button',
        props.skin.className,
        props.size.className,
        {
          'is-light': props.isLight,
          'is-fullwidth': props.isFullwidth,
          'is-outlined': props.isOutlined,
          'is-inverted': props.isInverted,
          'is-rounded': props.isRounded,
          'is-hovered': props.isHovered,
          'is-focused': props.isFocused,
          'is-active': props.isActive,
          'is-loading': props.isLoading,
          'is-static': props.isStatic,
        },
        props.className,
      )}
      disabled={props.isDisabled}
    >
      {props.children}
    </button>
  )
}
