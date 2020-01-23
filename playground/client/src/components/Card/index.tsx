import React from 'react'
import {FC} from 'react-forward-props'
import clsx from 'clsx'

type CardProps = {}

const Card: FC<'div', CardProps> = props => {
  return (
    <div {...props} className={clsx('card', props.className)}>
      {props.children}
    </div>
  )
}

type CardHeaderProps = {}

const CardHeader: FC<'div', CardHeaderProps> = props => {
  return (
    <div {...props} className={clsx('card-header', props.className)}>
      {props.children}
    </div>
  )
}

type CardHeaderTitleProps = {
  as?: React.ComponentType
}

const CardHeaderTitle: FC<'div', CardHeaderTitleProps> = props => {
  const As = props.as || 'div'

  return (
    <As {...props} className={clsx('card-header-title', props.className)}>
      {props.children}
    </As>
  )
}

type CardHeaderIconProps = {
  as?: React.ComponentType
}

const CardHeaderIcon: FC<'div', CardHeaderIconProps> = props => {
  const As = props.as || 'div'

  return (
    <As {...props} className={clsx('card-header-icon', props.className)}>
      {props.children}
    </As>
  )
}

type CardContentProps = {}

const CardContent: FC<'div', CardContentProps> = props => {
  return (
    <div {...props} className={clsx('card-content', props.className)}>
      {props.children}
    </div>
  )
}

type CardFooterProps = {}

const CardFooter: FC<'footer', CardFooterProps> = props => {
  return (
    <footer {...props} className={clsx('card-footer', props.className)}>
      {props.children}
    </footer>
  )
}

type CardFooterItemProps = {
  as?: React.ComponentType
}

const CardFooterItem: FC<'div', CardFooterItemProps> = props => {
  const As = props.as || 'div'

  return (
    <As {...props} className={clsx('card-footer', props.className)}>
      {props.children}
    </As>
  )
}

export {Card, CardHeader, CardHeaderTitle, CardHeaderIcon, CardContent, CardFooter, CardFooterItem}
