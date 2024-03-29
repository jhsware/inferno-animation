export function addClassName (node, className) {
  if (className) {
    const tmp = className.split(' ')
    for (let i=0; i < tmp.length; i++) {
      node.classList.add(tmp[i])
    }
  }
}

export function removeClassName (node, className) {
  if (className) {
    const tmp = className.split(' ')
    for (let i=0; i < tmp.length; i++) {
      node.classList.remove(tmp[i])
    }
  }
}

export function forceReflow () {
  var dummy = document.body.clientHeight
}

export function setDisplay(node, value) {
  var oldVal = node.style.getPropertyValue('display')
  if (oldVal !== value) {
    if (value) {
      node.style.setProperty('display', value)
    }
    else {
      if (node.style.length === 1 && node.style.hasOwnProperty('display')) {
        // If it is the only style prop then we remove it entirely
        node.removeAttribute('style')
      }
      else {
        node.style.removeProperty('display')
      }
    }
  }
  return oldVal
}

function _cleanStyle(node) {
  if (!node.style) {
    node.removeAttribute('style')
  }
}

export function getDimensions(node) {
  var tmpDisplay = node.style.getPropertyValue('display')
  var isDisplayNone = window.getComputedStyle(node).getPropertyValue('display') === 'none'
  if (isDisplayNone) {
    node.style.setProperty('display', 'block')
  }
  
  var tmp = node.getBoundingClientRect()

  if (isDisplayNone) {
    // node.style.display = tmpDisplay
    node.style.setProperty('display', tmpDisplay)
    _cleanStyle(node)
  }

  return {
    width: tmp.width,
    height: tmp.height
  }
}

export function setDimensions(node, width, height) {
  node.style.width = width + 'px'
  node.style.height = height + 'px'
}

export function clearDimensions(node) {
  node.style.width = node.style.height = ''
}

export function animationIsRunningOnParent(node) {
  return (node.closest && node.closest('.InfernoAnimation--noAnim'))
}

function _getMaxTransitionDuration (nodes) {
  let nrofTransitions = 0
  let maxDuration = 0
  for (let i=0; i < nodes.length; i++) {
    const node = nodes[i]
    if (!node) continue

    const cs = window.getComputedStyle(node)
    const dur = cs.getPropertyValue('transition-duration').split(',')
    const del = cs.getPropertyValue('transition-delay').split(',')
    const props = cs.getPropertyValue('transition-property').split(',').map((prop) => prop.trim())
    props.forEach((prop) => {
      if (prop[0] === '-') {
        let tmp = prop.split('-').splice(2).join('-')
        if (props.indexOf(tmp) >= 0) {
          nrofTransitions--
        }
      }
    })
    const animTimeout = dur.map((v, index) => parseFloat(v) + parseFloat(del[index])).reduce((prev, curr) => prev > curr ? prev : curr, 0)

    nrofTransitions += dur.length
    if (animTimeout > maxDuration) {
      maxDuration = animTimeout
    }
  }
  
  return {
    nrofTransitions: nrofTransitions,
    maxDuration: maxDuration
  }
}

function whichTransitionEvent(){
  var t;
  var el = document.createElement('fakeelement');
  var transitions = {
    'transition':'transitionend',
    'OTransition':'oTransitionEnd',
    'MozTransition':'transitionend',
    'WebkitTransition':'webkitTransitionEnd'
  }

  for(t in transitions){
      if( el.style[t] !== undefined ){
          return transitions[t];
      }
  }
}
var transitionEndName

export function registerTransitionListener(nodes, callback, noTimeout) {
  // I am doing this lazily because there where issues with document being undefined
  // and checks seemed to go bust due to transpilation
  if (!transitionEndName) {
    transitionEndName = whichTransitionEvent()
  }

  if (!Array.isArray(nodes)) {
    nodes = [nodes]
  }
  else {
    // Make sure we don't have undefined nodes (happens when an animated el doesn't have children)
    nodes = nodes.filter((node) => node)
  }
  const rootNode = nodes[0]

  rootNode.classList.add('InfernoAnimation-active')

  /**
   * Here comes the transition event listener
   */ 
  let { nrofTransitions: nrofTransitionsLeft, maxDuration } = _getMaxTransitionDuration(nodes)
  let done = false

  function onTransitionEnd (event) {
    // Make sure this is an actual event
    if (!event || done) {
      return
    }

    if (!event.timeout) {
      // Make sure it isn't a child that is triggering the event
      var goAhead = false
      for (var i=0; i < nodes.length; i++) {
        if (event.target === nodes[i]) {
          goAhead = true
          break
        }
      }
      if (!goAhead) return
  
      // Wait for all transitions
      if (--nrofTransitionsLeft > 0) {
        return
      }
    }

    // This is it...
    done = true

    /**
     * Perform cleanup
     */ 
    rootNode.classList.remove('InfernoAnimation-active')
    rootNode.removeEventListener(transitionEndName, onTransitionEnd, false)
    callback && callback()
  }
  rootNode.addEventListener(transitionEndName, onTransitionEnd, false)

  // Fallback if transitionend fails
  // This is disabled during debug so we can set breakpoints
  if (!window.debugAnimations && !noTimeout) {
    if (rootNode.nodeName === 'IMG' && !rootNode.complete) {
      // Image animations should wait for loaded until the timeout is started, otherwise animation will be cut short
      // due to loading delay
      rootNode.addEventListener('load', () => {
        setTimeout(() => onTransitionEnd({ target: rootNode, timeout: true }), Math.round(maxDuration * 1000) + 100) 
      })
    }
    else {
      setTimeout(() => onTransitionEnd({ target: rootNode, timeout: true }), Math.round(maxDuration * 1000) + 100) 
    }
  }
}
