import React, {useState, useEffect} from 'react'
import bowser from 'bowser'
import {useParams, Redirect} from 'react-router-dom'
import {isUuid} from 'uuidv4'
import {ClaimElement} from '@bloomprotocol/claim-kit-react'
import clsx from 'clsx'
import {AtomicVCV1} from '@bloomprotocol/vc-common'

import {Shell} from '../../components/Shell'
import {sitemap} from '../../sitemap'
import {BouncingDots} from '../../components/BouncingDots'
import {Card, CardContent} from '../../components/Card'
import {Message, MessageHeader, MessageBody, MessageSkin} from '../../components/Message'
import {useCredGetConfig} from '../../query/cred'
import {resetSocketConnection, socketOn, socketOff} from '../../utils/socket'
import {api} from '../../api'
import {useLocalClient} from '../../components/LocalClientProvider'
import {Button} from '../../components/Button'
import {Delete} from '../../components/Delete'
import {JsonEditor} from '../../components/JsonEditor'

import './index.scss'

const useGetClaimedTypes = (ready: boolean) => {
  const [claimedVC, setClaimedVC] = useState<AtomicVCV1 | null | undefined>()

  useEffect(() => {
    let current = true

    const get = async () => {
      const token = new URLSearchParams(window.location.search).get('token')

      if (token) {
        try {
          const {vc} = await api.cred.getClaimedVC({id: token})
          if (current) setClaimedVC(vc)
        } catch {
          if (current) setClaimedVC(null)
        }
      }
    }

    void get()

    return () => {
      current = false
    }
  }, [])

  useEffect(() => {
    const socketCallback = (vc: any) => setClaimedVC(vc)

    if (ready) {
      resetSocketConnection()
      socketOn('notif/cred-claimed', socketCallback)
    }

    return () => {
      socketOff('notif/cred-claimed', socketCallback)
    }
  }, [ready])

  return claimedVC
}

type ClaimProps = {}

export const Claim: React.FC<ClaimProps> = props => {
  const isMobile = bowser.parse(window.navigator.userAgent).platform.type === 'mobile'
  const {id: token} = useParams<{id: string}>()
  const {data, error} = useCredGetConfig({id: token})
  const claimedVC = useGetClaimedTypes(data !== null)
  const {claimVC} = useLocalClient()
  const [errorMessage, setErrorMessage] = useState<string>()

  if (!isUuid(token)) return <Redirect to="/not-found" />

  const host = process.env.REACT_APP_SERVER_URL || `${window.location.protocol}//${window.location.host}`

  let children: React.ReactNode

  if (claimedVC) {
    children = (
      <Message skin={MessageSkin.success}>
        <MessageHeader>
          <p>Successfully Claimed Credential</p>
        </MessageHeader>
        <MessageBody>
          <div className="claim__claimed-vc-container">
            <JsonEditor value={claimedVC} mode="tree" />
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
      const endpoint = `/api/v1/cred/${token}/claim-${data.claimVersion}`

      cardContent = (
        <ClaimElement
          className="claim__qr-container"
          shouldRenderButton={isMobile}
          claimData={{
            version: 1,
            token,
            url: `${host}${endpoint}`,
          }}
          qrOptions={{size: 256}}
          buttonOptions={{
            callbackUrl: `${window.location.origin}${sitemap.claim(token)}?token=${token}`,
          }}
        />
      )

      localClientButton = (
        <Button
          isFullwidth
          onClick={async () => {
            const response = await claimVC(endpoint)

            if (response.kind === 'error') {
              setErrorMessage(response.message)
            }
          }}
        >
          Claim With Local DID
        </Button>
      )
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
              <Message className="claim__error-message" skin={MessageSkin.danger}>
                <MessageHeader>
                  <p>Error while claiming the credential:</p>
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

  const isNarrow = !data && !claimedVC

  return (
    <Shell titleSuffix="Claim">
      <h1 className="title is-1 has-text-weight-bold has-text-centered">Claim Credential</h1>
      <p className="subtitle has-text-centered">Claim a credential with a {isMobile ? 'click of a button' : 'scan of a QR code'}.</p>
      <div className="columns is-mobile is-centered">
        <div
          className={clsx('column is-one-third-desktop is-half-tablet', {
            'is-narrow': isNarrow,
            'is-full': claimedVC,
          })}
          style={{width: isNarrow && !claimedVC ? 'auto' : undefined}}
        >
          {children}
        </div>
      </div>
    </Shell>
  )
}
