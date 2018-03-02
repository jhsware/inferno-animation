'use strict'
import { Component } from 'inferno'
import { createElement } from 'inferno-create-element'
import { animateOnAdd, animateOnRemove } from './animatedComponent'

import {
  addClassName,
  animationIsRunningOnParent,
  removeClassName,
  registerTransitionListener,
  forceReflow,
  clearDimensions,
  getDimensions,
  setDimensions,
  setDisplay,
  doAnimate  } from './utils'

const animateSizeChange = function (node, animationName, sourceSize, targetSize) {
  if (animationIsRunningOnParent(node)) return

  // 1. Set dimensions
  setDimensions(node, sourceSize.width, sourceSize.height)
  // node.style.height = sourceSize.height + 'px'
  // node.style.width = sourceSize.width + 'px'
  forceReflow(node)

  // 2. Set an animation listener, code at end
  registerTransitionListener(node, function () {
    // *** Cleanup ***
    // callback && callback(clone)
    clearDimensions(node)
    node.classList.remove(animationName + '-cross-fade-active')
  })

  // 3. Activate transition
  node.classList.add(animationName + '-cross-fade-active')
  
  // 4. Activate target state
  setTimeout(() => {
    setDimensions(node, targetSize.width, targetSize.height)
  }, 5)
}

function _getSizeOfCrossFadeVnode (vNode) {
  const domEl = vNode.dom.parentElement
  domEl.classList.add('InfernoAnimation--getSize')
  forceReflow(domEl)
  const outpDimensions = getDimensions(domEl)
  domEl.classList.remove('InfernoAnimation--getSize')
  return outpDimensions
}

class CrossFade extends Component {
  constructor (props) {
    super(props)

    this.state = {
      active: false
    }
    
    this.setTargetSize = this.setTargetSize.bind(this)
    this.setSourceSize = this.setSourceSize.bind(this)
    this._animationCheck = this._animationCheck.bind(this)
  }

  _animationCheck () {
    if (this.state.active && this.targetSize && this.sourceSize && this.$V.dom) {
      animateSizeChange(this.$V.dom, this.props.prefix, this.sourceSize, this.targetSize)
      this.targetSize = this.sourceSize = undefined
    }
  }

  componentDidMount () {
    setTimeout(() => {
      this.targetSize = this.sourceSize = undefined
      this.setState({
        active: true
      })
    }, 10)
  }

  setTargetSize (vNode) {
    this.targetSize = _getSizeOfCrossFadeVnode(vNode)
    this._animationCheck()
  }

  setSourceSize (vNode) {
    this.sourceSize = _getSizeOfCrossFadeVnode(vNode)
    this._animationCheck()
  }

  render () {
    const elProps = {}
    if (this.props.className) {
      // Using 'InfernoAnimation--noAnim' to block animations in children
      elProps['className'] = this.props.className + (!this.state.active ? ' InfernoAnimation--noAnim' : '')
    } else if (!this.state.active) {
      elProps['className'] = 'InfernoAnimation--noAnim'
    }
    
    const children = (!Array.isArray(this.props.children) ? [this.props.children] : this.props.children)

    const childEls = children.map((childEl) => createElement(CrossFadeItem, {
      // onComponentDidMount: this.setTargetSize, onComponentWillUnmount: this.setSourceSize, key: childEl.key
      onEnter: this.setTargetSize, onLeave: this.setSourceSize, key: childEl && childEl.key, prefix: this.props.prefix
    }, childEl))  

    return createElement(
      this.props.el || this.props.tag || 'div', 
      elProps, 
      childEls
    )
  }
}

/*
function CrossFadeItem (props) {
  return (
    <div className="CrossFadeItem">
      {props.children}
    </div>
  )
}
*/

class CrossFadeItem extends Component {

  componentDidMount () {
    this.props.onEnter(this.$V)
    const node = this.$V.dom
    setTimeout(() => animateOnAdd(node, this.props.prefix))
  }

  componentWillUnmount () {
    this.props.onLeave(this.$V)
    const node = this.$V.dom
    setTimeout(() => animateOnRemove(node, this.props.prefix))
  }

  render () {
    return (
      <div className="CrossFadeItem">
        {this.props.children}
      </div>
    )
  }
}


export default CrossFade
