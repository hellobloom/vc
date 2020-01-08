import * as React from 'react'
import {
  renderRequestElement,
  RequestData,
  QROptions,
  ButtonOptions,
  ShouldRenderButton,
  RequestElementResult,
} from '@bloomprotocol/share-kit'
import {Component, forwardProps} from 'react-forward-props'

export type RequestElementProps = {
  requestData: RequestData
  qrOptions?: Partial<QROptions>
  shouldRenderButton?: ShouldRenderButton
  buttonOptions: ButtonOptions
}

export class RequestElement extends Component<'div', RequestElementProps> {
  private container: HTMLDivElement | null
  private requestElementResult: RequestElementResult | null

  constructor(props: RequestElementProps) {
    super(props)

    this.container = null
    this.requestElementResult = null
  }

  componentDidMount() {
    if (!this.container) return

    const {requestData, shouldRenderButton, qrOptions, buttonOptions} = this.props
    this.requestElementResult = renderRequestElement({
      container: this.container,
      requestData,
      qrOptions,
      shouldRenderButton,
      buttonOptions,
    })
  }

  componentDidUpdate(prevProps: RequestElementProps) {
    if (!this.requestElementResult) return

    const {requestData: prevRequestData, qrOptions: prevQROptions, buttonOptions: prevButtonOptions} = prevProps
    const {requestData, qrOptions, buttonOptions} = this.props

    if (prevRequestData !== requestData || prevQROptions !== qrOptions || prevButtonOptions !== buttonOptions) {
      this.requestElementResult.update({requestData, qrOptions, buttonOptions})
    }
  }

  componentWillUnmount() {
    if (this.requestElementResult) {
      this.requestElementResult.remove()
    }
  }

  render() {
    return (
      <div
        {...forwardProps(this.props, 'requestData', 'shouldRenderButton', 'qrOptions', 'buttonOptions')}
        ref={element => {
          this.container = element
        }}
      />
    )
  }
}
