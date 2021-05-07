import {
  addClassName,
  animationIsRunningOnParent,
  removeClassName,
  registerTransitionListener,
  forceReflow,
  clearDimensions,
  getDimensions,
  setDimensions,
  setDisplay
} from './utils'

export const animateOnRemove = function (node, animationName, callback, animatedChildClass) {
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
  clone.setAttribute('data-isClone', '')

  // If we animate a decendent we need to find that specific node
  let animatedClone = clone
  let animatedNode = node
  if (animatedChildClass !== undefined) {
    animatedNode = node.querySelector('.' + animatedChildClass)
    animatedClone = clone.querySelector('.' + animatedChildClass)
  }

  const { width, height } = getDimensions(animatedNode)
  setDimensions(animatedClone, width, height)
  addClassName(clone, animCls.start)
  // Leaving original element so it can be removed in the normal way
  setDisplay(node, 'none !important')
  node.insertAdjacentElement('beforebegin', clone)

  // 2. Activate transitions
  addClassName(clone, animCls.active)

  // 3. Set an animation listener, code at end
  // Needs to be done after activating so timeout is calculated correctly
  registerTransitionListener(animatedClone, function () {
    // *** Cleanup ***
    callback && callback(animatedClone)
    clone.remove()
  })

  // 4. Activate target state
  setTimeout(() => {
    addClassName(clone, animCls.end)
    removeClassName(clone, animCls.start)
    clearDimensions(animatedClone)
  }, 5)
}

export const animateOnAdd = function (node, animationName, callback, animatedChildClass) {
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
  // If we animate a decendent we need to find that specific node
  let animatedNode = node
  if (animatedChildClass !== undefined) {
    animatedNode = node.querySelector('.' + animatedChildClass)
  }
  
  const { width, height } = getDimensions(animatedNode)
  addClassName(node, animCls.start)
  forceReflow()

  // 2. Activate transition
  addClassName(node, animCls.active)

  // 3. Set an animation listener, code at end
  // Needs to be done after activating so timeout is calculated correctly
  registerTransitionListener(animatedNode, function () {
    // *** Cleanup ***
    // 5. Remove the element
    clearDimensions(animatedNode)
    removeClassName(node, animCls.active)
    removeClassName(node, animCls.end)
    
    // 6. Call callback to allow stuff to happen
    callback && callback(animatedNode)
  })

  // 4. Activate target state
  setTimeout(() => {
    setDimensions(animatedNode, width, height)
    removeClassName(node, animCls.start)
    addClassName(node, animCls.end)
  }, 5)
}
