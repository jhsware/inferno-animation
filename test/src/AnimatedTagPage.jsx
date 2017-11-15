import Component from 'inferno-component'
import { Animated } from '../../index'

function Content (props) {
  return (
    <div className="SampleContent">
      <h3>This container should be of type Code!</h3>
      <p>This awesome feature, added by Félix Saparelli, means that for many of
      these use cases you never even need to call npxdirectly! The main difference
      between regular npx usage and the fallback is that the fallback doesn’t
      install new packages unless you use the pkg@versionsyntax: a safety net
      against potentially-dangerous typosquatting.</p>
    </div>
  )
}

class AnimatePage extends Component {
  constructor (props) {
    super(props)
    
    this.state = {
      visible: true,
      active: false
    }

    this.doToggle = this.doToggle.bind(this)
  }

  doToggle (e) {
    e.preventDefault()
    this.setState({
      visible: !this.state.visible
    })
  }

  componentDidMount () {
    setTimeout(() => {
      this.setState({
        active: true
      })
    }, 10)
  }

  render () {

    return (
      <div className={!this.state.active ? 'InfernoAnimation--noAnim' : ''}>
        <div className="ButtonBar">
          <a href="#toggle" className="btn btn-primary" onClick={this.doToggle}>Show / hide</a>
        </div>
        <h3>Animate on add/remove!</h3>
        <div className="SampleContainer">
          {this.state.visible && <Animated tag="code" className="Sample" prefix="Sample--Animation">
            <Content />
          </Animated>}
          <div>
            <p>And here is the rest</p>
          </div>
        </div>
      </div>
    )
  }
}

export default AnimatePage
