'use strict'
import Component from 'inferno-component'
import createElement from 'inferno-create-element'
import { animateOnAdd, animateOnRemove } from './animatedComponent'

const animateSizeChange = function (component, animationName, sourceSize, targetSize) {
  const node = component._vNode.dom
  // Do not animate if this class is set (should I do this by passing prop through context?)
  if (node.closest('.InfernoAnimation--noAnim')) {
    return
  }

  // 1. Get height and set start of animation
  node.style.height = sourceSize.height + 'px'
  node.style.width = sourceSize.width + 'px'


  // 2. Set an animation listener, code at end
  var done = false
  var nrofTransitionsLeft
  const onTransitionEnd = (event) => {
    // Make sure it isn't a child that is triggering the event
    if (event && event.target !== node) {
      return
    }
    if (event !== undefined && nrofTransitionsLeft > 0) {
      nrofTransitionsLeft--
      return
    }
    if (done) return
    done = true
    // 5. Remove the element
    // Note: If I don't declare an anonymous function immediately here this callback isn't called!
    node.style.height = node.style.width = ''
    node.classList.remove(animationName + '-cross-fade-active')
  }
  node.addEventListener("transitionend", onTransitionEnd, false)
  const dummy = node.clientHeight

  // 3. Activate transition
  node.classList.add(animationName + '-cross-fade-active')

  const cs = window.getComputedStyle(node)
  const dur = cs.getPropertyValue('transition-duration').split(',')
  const del = cs.getPropertyValue('transition-delay').split(',')
  const animTimeout = dur.map((v, index) => parseFloat(v) + parseFloat(del[index])).reduce((prev, curr) => prev > curr ? prev : curr, 0)
  nrofTransitionsLeft = dur.length - 1
  setTimeout(onTransitionEnd, Math.round(animTimeout * 1000) + 50) // Fallback if transitionend fails

  /*
  console.log('----- transition-duration', cs.getPropertyValue('transition-duration'))
  console.log('----- transition-delay', cs.getPropertyValue('transition-delay'))
  console.log('----- animTimeout', Math.round(animTimeout * 1000) + 50)
  */
  
  // 4. Activate target state
  setTimeout(() => {
    node.style.height = targetSize.height + 'px'
    node.style.width = targetSize.width + 'px'
  }, 5)
}

function _getSizeOfCrossFadeVnode (vNode) {
  const domEl = vNode.dom.parentElement
  domEl.classList.add('InfernoAnimation--getSize')
  const height = domEl.offsetHeight
  const width = domEl.offsetWidth
  domEl.classList.remove('InfernoAnimation--getSize')
  return { width, height }
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
    if (this.state.active && this.targetSize && this.sourceSize && this._vNode.dom) {
      animateSizeChange(this, this.props.prefix, this.sourceSize, this.targetSize)
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
    
    const childEls = this.props.children.map((childEl) => createElement(CrossFadeItem, {
      // onComponentDidMount: this.setTargetSize, onComponentWillUnmount: this.setSourceSize, key: childEl.key
      onEnter: this.setTargetSize, onLeave: this.setSourceSize, key: childEl.key, prefix: this.props.prefix
    }, childEl))


    return createElement(
      this.props.el || 'div', 
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
    this.props.onEnter(this._vNode)
    animateOnAdd(this, this.props.prefix)
  }

  componentWillUnmount () {
    this.props.onLeave(this._vNode)
    animateOnRemove(this, this.props.prefix)
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
