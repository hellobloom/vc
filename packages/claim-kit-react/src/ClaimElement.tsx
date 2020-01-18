import * as React from 'react'
import {
  renderClaimElement,
  ClaimData,
  QROptions,
  ButtonOptions,
  ShouldRenderButton,
  ClaimElementResult,
} from '@bloomprotocol/claim-kit'
import {Component, forwardProps} from 'react-forward-props'

export type ClaimElementProps = {
  claimData: ClaimData
  qrOptions?: Partial<QROptions>
  shouldRenderButton?: ShouldRenderButton
  buttonOptions: ButtonOptions
}

export class ClaimElement extends Component<'div', ClaimElementProps> {
  private container: HTMLDivElement | null
  private claimElementResult: ClaimElementResult | null

  constructor(props: ClaimElementProps) {
    super(props)

    this.container = null
    this.claimElementResult = null
  }

  componentDidMount() {
    if (!this.container) return

    const {claimData, shouldRenderButton, qrOptions, buttonOptions} = this.props
    this.claimElementResult = renderClaimElement({
      container: this.container,
      claimData,
      qrOptions,
      shouldRenderButton,
      buttonOptions,
    })
  }

  componentDidUpdate(prevProps: ClaimElementProps) {
    if (!this.claimElementResult) return

    const {claimData: prevclaimData, qrOptions: prevQROptions, buttonOptions: prevButtonOptions} = prevProps
    const {claimData, qrOptions, buttonOptions} = this.props

    if (prevclaimData !== claimData || prevQROptions !== qrOptions || prevButtonOptions !== buttonOptions) {
      this.claimElementResult.update({claimData, qrOptions, buttonOptions})
    }
  }

  componentWillUnmount() {
    if (this.claimElementResult) {
      this.claimElementResult.remove()
    }
  }

  render() {
    return (
      <div
        {...forwardProps(this.props, 'claimData', 'shouldRenderButton', 'qrOptions', 'buttonOptions')}
        ref={element => {
          this.container = element
        }}
      />
    )
  }
}
