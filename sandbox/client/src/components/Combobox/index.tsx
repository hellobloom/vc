import React from 'react'
import * as Base from '@reach/combobox'
import {FC} from 'react-forward-props'
import clsx from 'clsx'

import './index.scss'

export const Combobox = Base.Combobox

type ComboboxInputProps = Base.ComboboxInputProps

export const ComboboxInput: FC<'input', ComboboxInputProps> = props => (
  <Base.ComboboxInput {...props} className={clsx('input', props.className)}>
    {props.children}
  </Base.ComboboxInput>
)

type ComboboxPopoverProps = Base.ComboboxPopoverProps

export const ComboboxPopover: FC<'div', ComboboxPopoverProps> = props => (
  <Base.ComboboxPopover {...(props as any)} className={clsx('dropdown-menu', props.className)}>
    {props.children}
  </Base.ComboboxPopover>
)

type ComboboxListProps = Base.ComboboxListProps

export const ComboboxList: FC<'ul', ComboboxListProps> = props => (
  <Base.ComboboxList {...props} className={clsx('dropdown-content', props.className)}>
    {props.children}
  </Base.ComboboxList>
)

type ComboboxOptionProps = Base.ComboboxOptionProps

export const ComboboxOption: FC<'li', ComboboxOptionProps> = props => (
  <Base.ComboboxOption {...(props as any)} className={clsx('dropdown-item', props.className)}>
    {props.children}
  </Base.ComboboxOption>
)
