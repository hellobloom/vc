import React from 'react'
import clsx from 'clsx'
import {FC} from 'react-forward-props'

import './index.scss'

type BouncingDotsProps = {}

const BouncingDots: FC<'div', BouncingDotsProps> = props => (
  <div {...props} className={clsx('loading--bouncing-dots', props.className)}>
    <svg className="loading--bouncing-dots__content" width="60" height="20" viewBox="0 0 60 20" xmlns="http://www.w3.org/2000/svg">
      <circle className="loading--bouncing-dots__item" cx="7" cy="15" r="4" />
      <circle className="loading--bouncing-dots__item" cx="30" cy="15" r="4" />
      <circle className="loading--bouncing-dots__item" cx="53" cy="15" r="4" />
    </svg>
  </div>
)

export {BouncingDots}
