'use strict'
import Component from 'inferno-component'
import createElement from 'inferno-create-element'
import { animateOnAdd, animateOnRemove } from './animatedComponent'

class Animated extends Component {

  componentDidMount () {
    animateOnAdd(this, this.props.prefix)
  }

  componentWillUnmount () {
    animateOnRemove(this, this.props.prefix)
  }

  render () {
    const elProps = {}
    if (this.props.className) {
      elProps['className'] = this.props.className
    }
    
    return createElement(
      this.props.el || 'div', 
      elProps, 
      this.props.children
    )
  }
}

export default Animated
