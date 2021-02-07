import { createElement } from 'inferno-create-element'
import { animateOnAdd, animateOnRemove } from './animatedComponent'

function OriginalAnimated ({ domRef, el, tag, children, ...attrs}) {

  return createElement(
    tag || el || 'div',
    {ref: domRef, ...attrs}, 
    children
  )
}

function Animated ({ domRef, prefix, onDidEnter, onDidLeave, ...attrs}) {
  // I can't pass the ref callback through the ref attr so using domRef as
  // a work around.
  return <OriginalAnimated {...attrs}
    domRef={domRef}
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