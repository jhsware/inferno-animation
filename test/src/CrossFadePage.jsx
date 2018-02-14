import { Component } from 'inferno'
import { CrossFade } from '../../index'

function PageOne (props) {
  return (
    <div className="CrossFadeContent PageOne">
      <h3>Page One!</h3>
      <p>This awesome feature, added by Félix Saparelli, means that for many of
      these use cases you never even need to call npxdirectly! The main difference
      between regular npx usage and the fallback is that the fallback doesn’t
      install new packages unless you use the pkg@versionsyntax: a safety net
      against potentially-dangerous typosquatting.</p>
    </div>
  )
}

function PageTwo (props) {
  return (
    <div className="CrossFadeContent PageTwo">
      <h3>Page Two!</h3>
      <p>This awesome feature, added by Félix Saparelli, means that for many of
      these use cases you never even need to call npxdirectly! The main difference
      between regular npx usage.</p>
    </div>
  )
}

class CrossFadePage extends Component {
  constructor (props) {
    super(props)
    
    this.state = {
      visible: true
    }

    this.doToggle = this.doToggle.bind(this)
  }

  doToggle (e) {
    e.preventDefault()
    this.setState({
      visible: !this.state.visible
    })
  }

  render () {

    return (
      <div>
        <div className="ButtonBar">
          <a href="#toggle" className="btn btn-primary" onClick={this.doToggle}>Toggle</a>
        </div>
        <h2>Cross Fade</h2>
        <h3>This should not animate on first render</h3>
        <h3>This should not animate on transition to</h3>
        <CrossFade className="CrossFadeContainer" prefix="CrossFade--Animation">
          {this.state.visible && <PageOne />}
          {!this.state.visible && <PageTwo />}
        </CrossFade>
        <p>Other content</p>
      </div>
    )
  }
}

export default CrossFadePage
