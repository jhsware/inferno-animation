'use strict'
import { Component } from 'inferno'
import { createElement } from 'inferno-create-element'
import { animateOnAdd, animateOnRemove } from './animatedComponent'
import { animateBootstrapOnAdd, animateBootstrapOnRemove } from './animatedBootstrap'

const excludeProps = {
  el: true,
  tag: true,
  prefix: true,
  bootstrapCls: true,
  prefixLeave: true,
  children: true
}

function OriginalAnimated (props) {
  const attr = {}
  const keys = Object.keys(props)
  for (let i = 0; i < keys.length; i++) {
    let tmpKey = keys[i]
    if (!excludeProps[tmpKey]) {
      attr[tmpKey] = props[tmpKey]
    }
  }

  return createElement(
    props.el || props.tag || 'div', 
    attr, 
    props.children
  )
}


function BootstrapAnimated (props) {
  const attr = {}
  const keys = Object.keys(props)
  for (let i = 0; i < keys.length; i++) {
    let tmpKey = keys[i]
    if (!excludeProps[tmpKey]) {
      attr[tmpKey] = props[tmpKey]
    }
  }

  return createElement(
    props.el || props.tag || 'div', 
    attr, 
    props.children
  )
}

function Animated (props) {
  if (props.target === 'bootstrap') {
    const animCls = {
      start: props.prefix.hide, // 'collapse'
      active: props.prefix.active, // 'collapsing'
      end: props.prefix.show // 'collapse show'
    }
    return <BootstrapAnimated {...props}
      onComponentDidMount={(dom) => animateBootstrapOnAdd(dom, animCls, props.onDidEnter)}
      onComponentWillUnmount={(dom) => animateBootstrapOnRemove(dom, animCls, props.onDidLeave)} />
  } else {
    return <OriginalAnimated {...props}
      onComponentDidMount={(dom) => animateOnAdd(dom, props.prefix, props.onDidEnter)}
      onComponentWillUnmount={(dom) => animateOnRemove(dom, props.prefix, props.onDidLeave)} />
  }
}

export default Animated
