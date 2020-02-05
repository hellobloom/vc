import React, {useState} from 'react'
import {FC} from 'react-forward-props'
import {Link, NavLink} from 'react-router-dom'
import clsx from 'clsx'

import {ReactComponent as Logo} from './logo.svg'
import {useDocumentTitle} from '../../utils/hooks'
import {sitemap} from '../../sitemap'

import './index.scss'

const useDocumentTitleSuffix = (titleSuffix?: string) => {
  useDocumentTitle(`VC Sandbox${titleSuffix ? ` - ${titleSuffix}` : ''}`)
}

type ShellProps = {
  titleSuffix?: string
}

export const Shell: FC<'div', ShellProps> = props => {
  useDocumentTitleSuffix(props.titleSuffix)
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="shell">
      <nav className="navbar has-shadow is-spaced">
        <div className="container">
          <div className="navbar-brand">
            <Link to={sitemap.home} className="navbar-item">
              <Logo />
            </Link>
            <div className={clsx('navbar-burger', 'burger', {'is-active': isOpen})} onClick={() => setIsOpen(!isOpen)}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div className={clsx('navbar-menu', {'is-active': isOpen})}>
            <NavLink to={sitemap.issue} className="navbar-item" activeClassName="is-active">
              Issue Credential
            </NavLink>
            <NavLink to={sitemap.request} className="navbar-item" activeClassName="is-active">
              Request Credentials
            </NavLink>
          </div>
        </div>
      </nav>
      <main className="shell__main">
        <div className="container">
          <div className="shell__body">{props.children}</div>
        </div>
      </main>
    </div>
  )
}

type AdminShellProps = {
  titleSuffix?: string
}
