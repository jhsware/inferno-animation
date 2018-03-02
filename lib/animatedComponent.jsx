import { cloneVNode } from 'inferno'
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

export const animateOnRemove = function (node, animationName, callback) {
  if (animationIsRunningOnParent(node)) return

  let animCls = {}
  if (typeof animationName === 'object') {
    animCls = animationName
  } else {
    animCls['start'] = animationName + '-leave'
    animCls['active'] = animationName + '-leave-active'
    animCls['end'] = animationName + '-leave-end'
  }

  // 1. Clone DOM node, inject it and hide original
  const clone = node.cloneNode(true)
  const { width, height } = getDimensions(node)
  setDimensions(clone, width, height)
  addClassName(clone, animCls.start)
  // Leaving original element so it can be removed in the normal way
  setDisplay(node, 'none !important')
  node.insertAdjacentElement('beforebegin', clone)

  // 2. Set an animation listener, code at end
  registerTransitionListener(clone, function () {
    // *** Cleanup ***
    callback && callback(clone)
    clone.remove()
  })

  // 3. Activate transitions
  addClassName(clone, animCls.active)

  // 4. Activate target state
  setTimeout(() => {
    addClassName(clone, animCls.end)
    removeClassName(clone, animCls.start)
    clearDimensions(clone)
  }, 5)
}

export const animateOnAdd = function (node, animationName, callback) {
  if (animationIsRunningOnParent(node)) return

  let animCls = {}
  if (typeof animationName === 'object') {
    animCls = animationName
  } else {
    animCls['start'] = animationName + '-enter'
    animCls['active'] = animationName + '-enter-active'
    animCls['end'] = animationName + '-enter-end'
  }

  // 1. Get height and set start of animation
  const { width, height } = getDimensions(node)
  addClassName(node, animCls.start)
  forceReflow()

  // 2. Set an animation listener, code at end
  registerTransitionListener([node, node.children[0]], function () {
    // *** Cleanup ***
    // 5. Remove the element
    clearDimensions(node)
    removeClassName(node, animCls.active)
    removeClassName(node, animCls.end)
    
    // 6. Call callback to allow stuff to happen
    callback && callback(node)
  })

  // 3. Activate transition
  addClassName(node, animCls.active)
 
  // 4. Activate target state
  setTimeout(() => {
    setDimensions(node, width, height)
    removeClassName(node, animCls.start)
    addClassName(node, animCls.end)
  }, 5)
}
