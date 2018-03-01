import { cloneVNode } from 'inferno'
import {
  addClassName,
  removeClassName,
  registerTransitionListener,
  forceReflow,
  clearDimensions,
  getDimensions,
  setDimensions,
  setDisplay,
  animationIsRunningOnParent,
  doAnimate  } from './utils'

export const animateBootstrapOnRemove = function (node, animCls, callback) {
  const clone = node.cloneNode(true)
  const { width, height } = getDimensions(node)

  setDimensions(clone, width, height)
  addClassName(clone, animCls.end)
  setDisplay(node, 'none !important')
  node.insertAdjacentElement('beforebegin', clone)
  
  addClassName(clone, animCls.active)

  registerTransitionListener(clone, function () {
    // *** Cleanup ***
    callback && callback(clone)
    clone.remove()
  })

  setTimeout(() => {
    removeClassName(clone, animCls.end)
    clearDimensions(clone)
  }, 5)
}


export const animateBootstrapOnAdd = function (node, animCls, callback) {
  const { width, height } = getDimensions(node)
  addClassName(node, animCls.start)
  forceReflow()

  addClassName(node, animCls.active)
  setDisplay(node, 'block')
  
  registerTransitionListener([node, node.children[0]], function () {
    // *** Cleanup ***
    removeClassName(node, animCls.active)
    clearDimensions(node)
    callback && callback(node)
  })

  //setTimeout(() => {
  setDimensions(node, width, height)
  addClassName(node, animCls.end)
  removeClassName(node, animCls.start)
  //}, 5) 
}
