import React, {useCallback, useState, useEffect} from 'react'
import {RequestElement, Action} from '@bloomprotocol/share-kit-react'
import {TAttestationTypeNames} from '@bloomprotocol/attestations-common'
import {useParams, Redirect} from 'react-router-dom'
import {isUuid} from 'uuidv4'
import bowser from 'bowser'
import clsx from 'clsx'

import {Shell} from '../../components/Shell'
import {useShareGetConfig} from '../../query/share'
import {BouncingDots} from '../../components/BouncingDots'
import {sitemap} from '../../sitemap'
import {api} from '../../api'
import {resetSocketConnection, socketOn, socketOff} from '../../utils/socket'
import {Message, MessageHeader, MessageBody, MessageSkin} from '../../components/Message'
import {Card, CardContent} from '../../components/Card'
import {Button} from '../../components/Button'
import {useLocalClient} from '../../components/LocalClientProvider'
import {Delete} from '../../components/Delete'
import {JsonEditor} from '../../components/JsonEditor'

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

  useEffect(() => {
    const socketCallback = async (verifiableCredential: any) => {
      setSharedData(verifiableCredential)
    }

    if (ready) {
      resetSocketConnection()
      socketOn('notif/share-recieved', socketCallback)
    }

    return () => {
      socketOff('notif/share-recieved', socketCallback)
    }
  }, [ready])

  return sharedData
}

type ShareProps = {}

export const Share: React.FC<ShareProps> = props => {
  const isMobile = bowser.parse(window.navigator.userAgent).platform.type === 'mobile'
  const {id: token} = useParams<{id: string}>()
  const {data, error} = useShareGetConfig({id: token})
  const sharedData = useGetSharedTypes(data !== null)
  const {shareVCs} = useLocalClient()
  const [errorMessage, setErrorMessage] = useState<string>()

  if (!isUuid(token)) return <Redirect to="/not-found" />

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
            <JsonEditor value={sharedData} />
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
    let localClientButton: React.ReactNode | undefined

    if (data) {
      const endpoint = `/api/v1/share/recieve-${data.responseVersion}`

      cardContent = (
        <RequestElement
          className="share__qr-container"
          shouldRenderButton={() => isMobile}
          requestData={{
            action: Action.attestation,
            token,
            url: `${host}${endpoint}`,
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

      if (data.responseVersion === 'v1') {
        localClientButton = (
          <Button
            isFullwidth
            onClick={async () => {
              const response = await shareVCs(data.types, token, endpoint)

              if (response.kind === 'error') {
                setErrorMessage(response.message)
              }
            }}
          >
            Share From Local Client
          </Button>
        )
      }
    } else {
      cardContent = <BouncingDots />
    }

    children = (
      <React.Fragment>
        <Card>
          <CardContent>
            {cardContent}
            {localClientButton && (
              <React.Fragment>
                <div className="is-divider" data-content="OR" />
                {localClientButton}
              </React.Fragment>
            )}
            {errorMessage && (
              <Message className="share__error-message" skin={MessageSkin.danger}>
                <MessageHeader>
                  <p>Error while sharing credentials:</p>
                  <Delete onClick={() => setErrorMessage(undefined)} aria-label="clear message" />
                </MessageHeader>
                <MessageBody>{errorMessage}</MessageBody>
              </Message>
            )}
          </CardContent>
        </Card>
      </React.Fragment>
    )
  }

  const isNarrow = (!data || data.responseVersion === 'v0') && !sharedData

  return (
    <Shell titleSuffix="Share">
      <h1 className="title is-1 has-text-weight-bold has-text-centered">Share Credentials</h1>
      <p className="subtitle has-text-centered">
        Share requested credentials with a {isMobile ? 'click of a button' : 'scan of a QR code'}.
      </p>
      <div className="columns is-mobile is-centered">
        <div
          className={clsx('column is-one-third-desktop is-half-tablet', {
            'is-narrow': isNarrow,
            'is-full': sharedData,
          })}
          style={{width: isNarrow && !sharedData ? 'auto' : undefined}}
        >
          {children}
        </div>
      </div>
    </Shell>
  )
}
