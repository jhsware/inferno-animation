'use strict'
import { Component } from 'inferno'
import { createElement } from 'inferno-create-element'
import { animateOnAdd, animateOnRemove } from './animatedComponent'

const excludeProps = {
  el: true,
  tag: true,
  prefix: true,
  bootstrapCls: true,
  prefixLeave: true,
  children: true
}

class Animated extends Component {

  componentDidMount () {
    let cls = this.props.bootstrapCls
    if (cls) {
      cls = {
        start: undefined, // ''
        active: cls.active, // 'collapsing'
        end: cls.show // 'collapse show'
      }
    }
    animateOnAdd(this, cls || this.props.prefix, this.props.onDidEnter)
  }

  componentWillUnmount () {
    let cls = this.props.bootstrapCls
    if (cls) {
      cls = {
        start: cls.show, // 'collapse show'
        active: cls.active, // 'collapsing'
        end: cls.hide // 'collapse'
      }
    }
    animateOnRemove(this, cls || this.props.prefix, this.props.onDidLeave)
  }

  render () {
    const props = {}
    const keys = Object.keys(this.props)
    for (let i = 0; i < keys.length; i++) {
      let tmpKey = keys[i]
      if (!excludeProps[tmpKey]) {
        props[tmpKey] = this.props[tmpKey]
      }
    }

    return createElement(
      this.props.el || this.props.tag || 'div', 
      props, 
      this.props.children
    )
  }
}

export default Animated
