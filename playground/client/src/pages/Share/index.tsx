import React, {useCallback, useState, useEffect} from 'react'
import {RequestElement, Action} from '@bloomprotocol/share-kit-react'
import {TAttestationTypeNames} from '@bloomprotocol/attestations-common'
import {useParams, Redirect} from 'react-router-dom'
import {isUuid} from 'uuidv4'
import bowser from 'bowser'
import JSONTree from 'react-json-tree'
import clsx from 'clsx'

import {Shell} from '../../components/Shell'
import {useShareGetConfig} from '../../query/share'
import {BouncingDots} from '../../components/BouncingDots'
import {sitemap} from '../../sitemap'
import {api} from '../../api'
import {resetSocketConnection, socketOn, socketOff} from '../../utils/socket'
import {Message, MessageHeader, MessageBody, MessageSkin} from '../../components/Message'
import {Card, CardContent} from '../../components/Card'

import './index.scss'

const useGetSharedTypes = (ready: boolean) => {
  const [sharedData, setSharedData] = useState<[] | null | undefined>()

  useEffect(() => {
    let current = true

    const get = async () => {
      const token = new URLSearchParams(window.location.search).get('token')

      if (token) {
        try {
          const {verifiableCredential} = await api.share.getSharedData({id: token})
          if (current) setSharedData(verifiableCredential)
        } catch {
          if (current) setSharedData(null)
        }
      }
    }

    void get()

    return () => {
      current = false
    }
  }, [])

  const socketCallback = useCallback(async verifiableCredential => {
    setSharedData(verifiableCredential)
  }, [])

  useEffect(() => {
    if (ready) {
      resetSocketConnection()
      socketOn('notif/share-recieved', socketCallback)
    }

    return () => {
      socketOff('notif/share-recieved', socketCallback)
    }
  }, [ready, socketCallback])

  return sharedData
}

type ShareProps = {}

export const Share: React.FC<ShareProps> = props => {
  const isMobile = bowser.parse(window.navigator.userAgent).platform.type === 'mobile'
  const {id: token} = useParams<{id: string}>()
  const {data, error} = useShareGetConfig({id: token})
  const sharedData = useGetSharedTypes(data !== null)

  if (!isUuid(token)) return <Redirect to={'/not-found'} />

  const host = process.env.REACT_APP_SERVER_URL || `${window.location.protocol}//${window.location.host}`

  let children: React.ReactNode

  if (sharedData) {
    children = (
      <Message skin={MessageSkin.success}>
        <MessageHeader>
          <p>Successfully Shared Credentials</p>
        </MessageHeader>
        <MessageBody>
          <div className="share__shared-data-container">
            <JSONTree data={sharedData} />
          </div>
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
            url: `${host}/api/v1/share/recieve-${data.responseVersion}`,
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
        <div className={clsx('column', {'is-narrow': !sharedData})}>{children}</div>
      </div>
    </Shell>
  )
}
