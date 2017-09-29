'use strict'
import Component from 'inferno-component'
import createElement from 'inferno-create-element'
import { animateOnAdd, animateOnRemove } from './animatedComponent'

class Animated extends Component {

  componentDidMount () {
    animateOnAdd(this, this.props.prefix, this.props.onDidEnter)
  }

  componentWillUnmount () {
    animateOnRemove(this, this.props.prefix, this.props.onDidLeave)
  }

  render () {
    return createElement(
      this.props.el || 'div', 
      this.props, 
      this.props.el || this.props.tag || 'div', 
      this.props.children
    )
  }
}

export default Animated
