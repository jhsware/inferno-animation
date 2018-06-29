import { createElement } from 'inferno-create-element'
import { animateOnAdd, animateOnRemove } from './animatedComponent'

function OriginalAnimated ({ el, tag, children, ...attrs}) {
  return createElement(
    tag || el || 'div', 
    attrs, 
    children
  )
}

function Animated ({ prefix, onDidEnter, onDidLeave, ...attrs}) {

  return <OriginalAnimated {...attrs}
    onComponentDidMount={(dom) => animateOnAdd(dom, prefix, onDidEnter)}
    onComponentWillUnmount={(dom) => animateOnRemove(dom, prefix, onDidLeave)} />
}

export default Animated

/*

// Why did this not work?

'use strict'
import { Component } from 'inferno'
import { createElement } from 'inferno-create-element'
import { animateOnAdd, animateOnRemove } from './animatedComponent'

function Animated ({ el, tag, prefix, onDidEnter, onDidLeave, children, ...attrs}) {

  attrs.onComponentDidMount = (dom) => animateOnAdd(dom, prefix, onDidEnter)
  attrs.onComponentWillUnmount = (dom) => animateOnRemove(dom, prefix, onDidLeave)

  return createElement(
    tag || el || 'div', 
    attrs, 
    children
  )
}

export default Animated

*/