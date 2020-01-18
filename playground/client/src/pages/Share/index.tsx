import React, {useCallback, useRef, useState} from 'react'
import {RequestElement, Action} from '@bloomprotocol/share-kit-react'
import {TAttestationTypeNames} from '@bloomprotocol/attestations-common'
import {useParams, Redirect} from 'react-router-dom'
import {isUuid} from 'uuidv4'
import bowser from 'bowser'

import {Shell} from '../../components/Shell'
import {useShareGetTypes} from '../../query/share'
import {BouncingDots} from '../../components/BouncingDots'
import {sitemap} from '../../sitemap'
import {api} from '../../api'
import {useSocket} from '../../utils/hooks'
import {useEffect} from 'react'

const useGetSharedTypes = (isMobile: boolean, token: string) => {
  const [sharedTypes, setSharedTypes] = useState<string[] | null | undefined>()

  useEffect(() => {
    let current = true

    const get = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const token = urlParams.get('token')

      if (token) {
        try {
          const {types} = await api.share.getSharedData({id: token})
          if (current) setSharedTypes(types)
        } catch {
          if (current) setSharedTypes(null)
        }
      }
    }

    void get()

    return () => {
      current = false
    }
  }, [])

  const socketCallback = useCallback(async () => {
    try {
      const {types} = await api.share.getSharedData({id: token})
      setSharedTypes(types)
    } catch {
      setSharedTypes(null)
    }
  }, [token])

  useSocket('notif/share-recieved', socketCallback, !isMobile)

  return sharedTypes
}

type ShareProps = {}

export const Share: React.FC<ShareProps> = props => {
  const isMobile = useRef(bowser.parse(window.navigator.userAgent).platform.type === 'mobile').current
  const {id: token} = useParams<{id: string}>()
  const {data} = useShareGetTypes({id: token})
  const sharedTypes = useGetSharedTypes(isMobile, token)

  if (!isUuid(token)) return <Redirect to={'/not-found'} />

  const host = process.env.REACT_APP_SERVER_URL || `${window.location.protocol}//${window.location.host}`

  let children: React.ReactNode

  if (sharedTypes) {
    children = (
      <div>
        You shared the following data:
        <ul>
          {sharedTypes.map(type => (
            <li key={type}>{type.toUpperCase()}</li>
          ))}
        </ul>
      </div>
    )
  } else if (data) {
    children = (
      <RequestElement
        requestData={{
          action: Action.attestation,
          token,
          url: `${host}/api/v1/share/recieve`,
          org_name: 'Attestation Playground',
          org_logo_url: 'https://bloom.co/images/notif/bloom-logo.png',
          org_usage_policy_url: 'https://bloom.co/legal/terms',
          org_privacy_policy_url: 'https://bloom.co/legal/privacy',
          // TODO: make this not typed to our attestation names
          types: data.types as TAttestationTypeNames[],
        }}
        buttonOptions={{
          callbackUrl: `${window.location.origin}${sitemap.share(token)}?token=${token}`,
        }}
      />
    )
  } else {
    children = <BouncingDots />
  }

  return <Shell titleSuffix="Share">{children}</Shell>
}
