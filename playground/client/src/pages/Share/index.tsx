import React, {useCallback, useState, useEffect} from 'react'
import {RequestElement, Action} from '@bloomprotocol/share-kit-react'
import {TAttestationTypeNames, AttestationTypes} from '@bloomprotocol/attestations-common'
import {useParams, Redirect} from 'react-router-dom'
import {isUuid} from 'uuidv4'
import bowser from 'bowser'

import {Shell} from '../../components/Shell'
import {useShareGetTypes} from '../../query/share'
import {BouncingDots} from '../../components/BouncingDots'
import {sitemap} from '../../sitemap'
import {api} from '../../api'
import {resetSocketConnection, socketOn, socketOff} from '../../utils/socket'
import {Message, MessageHeader, MessageBody, MessageSkin} from '../../components/Message'
import {Card, CardContent} from '../../components/Card'

const useGetSharedTypes = (data: {types: string[]} | null) => {
  const [sharedTypes, setSharedTypes] = useState<string[] | null | undefined>()

  useEffect(() => {
    let current = true

    const get = async () => {
      const token = new URLSearchParams(window.location.search).get('token')

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

  const socketCallback = useCallback(async types => {
    setSharedTypes(types)
  }, [])

  useEffect(() => {
    if (data) {
      resetSocketConnection()
      socketOn('notif/share-recieved', socketCallback)
    }

    return () => {
      socketOff('notif/share-recieved', socketCallback)
    }
  }, [data, socketCallback])

  return sharedTypes
}

type ShareProps = {}

export const Share: React.FC<ShareProps> = props => {
  const isMobile = bowser.parse(window.navigator.userAgent).platform.type === 'mobile'
  const {id: token} = useParams<{id: string}>()
  const {data, error} = useShareGetTypes({id: token})
  const sharedTypes = useGetSharedTypes(data)

  if (!isUuid(token)) return <Redirect to={'/not-found'} />

  const host = process.env.REACT_APP_SERVER_URL || `${window.location.protocol}//${window.location.host}`

  let children: React.ReactNode

  if (sharedTypes) {
    children = (
      <Message skin={MessageSkin.success}>
        <MessageHeader>
          <p>Successfully Shared Credential Types</p>
        </MessageHeader>
        <MessageBody>
          <ul>
            {sharedTypes.map(type => {
              const manifest = AttestationTypes[type as any]
              const displayName = manifest ? manifest.nameFriendly : type

              return <li key={type}>{displayName}</li>
            })}
          </ul>
        </MessageBody>
      </Message>
    )
  } else if (error) {
    children = (
      <Message skin={MessageSkin.warning}>
        <MessageHeader>
          <p>Could Not Fetch Request</p>
        </MessageHeader>
        <MessageBody>Please ensure that the URL is correct.</MessageBody>
      </Message>
    )
  } else {
    let cardContent: React.ReactNode

    if (data) {
      cardContent = (
        <RequestElement
          shouldRenderButton={() => isMobile}
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
          qrOptions={{size: 256}}
          buttonOptions={{
            callbackUrl: `${window.location.origin}${sitemap.share(token)}?token=${token}`,
          }}
        />
      )
    } else {
      cardContent = <BouncingDots />
    }

    children = (
      <Card>
        <CardContent>{cardContent}</CardContent>
      </Card>
    )
  }

  return (
    <Shell titleSuffix="Share">
      <h1 className="title is-1 has-text-weight-bold has-text-centered">Share Credentials</h1>
      <p className="subtitle has-text-centered">
        Share requested credentials with a {isMobile ? 'click of a button' : 'scan of a QR code'}.
      </p>
      <div className="columns is-mobile is-centered">
        <div className="column is-narrow">{children}</div>
      </div>
    </Shell>
  )
}
