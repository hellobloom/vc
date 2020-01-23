import React, {useState, useEffect, useCallback} from 'react'
import bowser from 'bowser'
import {useParams, Redirect} from 'react-router-dom'
import {isUuid} from 'uuidv4'
import {ClaimElement} from '@bloomprotocol/claim-kit-react'
import clsx from 'clsx'
import JSONTree from 'react-json-tree'

import {Shell} from '../../components/Shell'
import {sitemap} from '../../sitemap'
import {BouncingDots} from '../../components/BouncingDots'
import {Card, CardContent} from '../../components/Card'
import {Message, MessageHeader, MessageBody, MessageSkin} from '../../components/Message'
import {useCredGetConfig} from '../../query/cred'
import {resetSocketConnection, socketOn, socketOff} from '../../utils/socket'
import {api} from '../../api'

import './index.scss'

const useGetClaimedTypes = (ready: boolean) => {
  const [claimedData, setClaimedData] = useState<[] | null | undefined>()

  useEffect(() => {
    let current = true

    const get = async () => {
      const token = new URLSearchParams(window.location.search).get('token')

      if (token) {
        try {
          const {claimNodes} = await api.cred.getClaimedData({id: token})
          if (current) setClaimedData(claimNodes)
        } catch {
          if (current) setClaimedData(null)
        }
      }
    }

    void get()

    return () => {
      current = false
    }
  }, [])

  const socketCallback = useCallback(async verifiableCredential => {
    setClaimedData(verifiableCredential)
  }, [])

  useEffect(() => {
    if (ready) {
      resetSocketConnection()
      socketOn('notif/cred-claimed', socketCallback)
    }

    return () => {
      socketOff('notif/cred-claimed', socketCallback)
    }
  }, [ready, socketCallback])

  return claimedData
}

type ClaimProps = {}

export const Claim: React.FC<ClaimProps> = props => {
  const isMobile = bowser.parse(window.navigator.userAgent).platform.type === 'mobile'
  const {id: token} = useParams<{id: string}>()
  const {data, error} = useCredGetConfig({id: token})
  const claimedData = useGetClaimedTypes(data !== null)

  if (!isUuid(token)) return <Redirect to={'/not-found'} />

  const host = process.env.REACT_APP_SERVER_URL || `${window.location.protocol}//${window.location.host}`

  let children: React.ReactNode

  if (claimedData) {
    children = (
      <Message skin={MessageSkin.success}>
        <MessageHeader>
          <p>Successfully Claimed Credential</p>
        </MessageHeader>
        <MessageBody>
          <div className="claim__claimed-data-container">
            <JSONTree data={claimedData} />
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
        <ClaimElement
          shouldRenderButton={isMobile}
          claimData={{
            version: 1,
            token,
            url: `${host}/api/v1/cred/${token}/claim-${data.claimVersion}`,
          }}
          qrOptions={{size: 256}}
          buttonOptions={{
            callbackUrl: `${window.location.origin}${sitemap.claim(token)}?token=${token}`,
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
    <Shell titleSuffix="Claim">
      <h1 className="title is-1 has-text-weight-bold has-text-centered">Claim Credential</h1>
      <p className="subtitle has-text-centered">Claim a credential with a {isMobile ? 'click of a button' : 'scan of a QR code'}.</p>
      <div className="columns is-mobile is-centered">
        <div className={clsx('column', {'is-narrow': !claimedData})}>{children}</div>
      </div>
    </Shell>
  )
}
