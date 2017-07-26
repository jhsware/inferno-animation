import { cloneVNode } from 'inferno'

function _addClassName (node, className) {
  const tmp = className.split(' ')
  for (let i=0; i < tmp.length; i++) {
    node.classList.add(tmp[i])
  }
}

function _removeClassName (node, className) {
  const tmp = className.split(' ')
  for (let i=0; i < tmp.length; i++) {
    node.classList.remove(tmp[i])
  }
}

export const animateOnRemove = function (component, animationName, callback) {
  const domEl = component._vNode.dom
  // Do not animate if this class is set (should I do this by passing prop through context?)
  if (domEl.closest && domEl.closest('.InfernoAnimation--noAnim')) {
    return
  }
  
  let animCls = {}
  if (typeof animationName === 'object') {
    animCls = animationName
  } else {
    animCls['start'] = animationName + '-leave'
    animCls['active'] = animationName + '-leave-active'
    animCls['end'] = animationName + '-leave-end'
  }

  // 1. Clone DOM node, inject it and hide original
  const clone = domEl.cloneNode(true)

  const height = domEl.offsetHeight
  const width = domEl.offsetWidth

  clone.style.height = height + 'px'
  clone.style.width = width + 'px'
  _addClassName(clone, animCls.start)

  // Leaving original element so it can be removed in the normal way
  domEl.style['display'] = 'none'
  domEl.insertAdjacentElement('beforebegin', clone)

  // 2. Set an animation listener, code at end
  var done = false
  var nrofTransitionsLeft
  const onTransitionEnd = (event) => {
    // Make sure it isn't a child that is triggering the event
    if (event && event.target !== clone) {
      return
    }
    if (event !== undefined && nrofTransitionsLeft > 0) {
      nrofTransitionsLeft--
      return
    }
    if (done) return
    done = true

    // 5. Call callback to allow stuff to happen
    callback && callback(clone)

    // 6. Remove the element
    // Note: If I don't declare an anonymous function immediately here this callback isn't called!
    // const parent = clone.parentElement
    // parent.removeChild(clone)
    // Why does inferno use removeChild?
    clone.remove()
    // console.log('----- removed')
  }

  clone.addEventListener("transitionend", onTransitionEnd, false)
  // 3. Activate transitions
  _addClassName(clone, animCls.active)
  // The following is needed so we can prevent nested animations from playing slower
  // than parent animation causing a jump (in for example a cross-fade)
  clone.classList.add('InfernoAnimation-active')

  const cs = window.getComputedStyle(clone)
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
    _addClassName(clone, animCls.end)
    _removeClassName(clone, animCls.start)
    clone.style.height = clone.style.width = ''
  }, 5)
}

export const animateOnAdd = function (component, animationName, callback) {
  const node = component._vNode.dom

  // Do not animate if this class is set (should I do this by passing prop through context?)
  if (node.closest && node.closest('.InfernoAnimation--noAnim')) {
    return
  }

  let animCls = {}
  if (typeof animationName === 'object') {
    animCls = animationName
  } else {
    animCls['start'] = animationName + '-enter'
    animCls['active'] = animationName + '-enter-active'
    animCls['end'] = animationName + '-enter-end'
  }

  const isDisplayNone = window.getComputedStyle(node).getPropertyValue('display') === 'none'

  // 1. Get height and set start of animation
  const height = node.offsetHeight
  const width = node.offsetWidth
  _addClassName(node, animCls.start)


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
    _removeClassName(node, animCls.active)
    _removeClassName(node, animCls.end)
    node.classList.remove('InfernoAnimation-active')
    
    // 6. Call callback to allow stuff to happen
    callback && callback(node)
  }
  node.addEventListener("transitionend", onTransitionEnd, false)
  const dummy = node.clientHeight

  // 3. Activate transition
  _addClassName(node, animCls.active)
  // The following is needed so we can prevent nested animations from playing slower
  // than parent animation causing a jump (in for example a cross-fade)
  node.classList.add('InfernoAnimation-active')

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
    if (!isDisplayNone) {
      node.style.height = height + 'px'
      node.style.width = width + 'px'
    }
    _removeClassName(node, animCls.end)
    _removeClassName(node, animCls.start)
  }, 5)
}
