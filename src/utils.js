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
  var oldVal = node.style.display
  if (oldVal !== value) {
    node.style.display = value
  }
  return oldVal
}

function _cleanStyle(node) {
  if (!node.style) {
    node.removeAttribute('style')
  }
}

export function getDimensions(node) {
  var tmpDisplay = node.style.display
  var isDisplayNone = window.getComputedStyle(node).getPropertyValue('display') === 'none'
  if (isDisplayNone) {
    node.style.display = 'block'
  }
  
  var tmp = node.getBoundingClientRect()

  if (isDisplayNone) {
    node.style.display = tmpDisplay
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

function _getMaxTransitionDuration (/* add nodes as args*/) {
  let nrofTransitions = 0
  let maxDuration = 0
  for (let i=0; i < arguments.length; i++) {
    const node = arguments[i]
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

export function registerTransitionListener(nodes, callback) {
  // I am doing this lazily because there where issues with document being undefined
  // and checks seemed to go bust due to transpilation
  if (!transitionEndName) {
    transitionEndName = whichTransitionEvent()
  }

  if (!Array.isArray(nodes)) {
    nodes = [nodes]
  }
  const rootNode = nodes[0]

  rootNode.classList.add('InfernoAnimation-active')

  /**
   * Here comes the transition event listener
   */ 
  let { nrofTransitions: nrofTransitionsLeft, maxDuration } = _getMaxTransitionDuration.apply(this, nodes)
  let done = false

  function onTransitionEnd (event) {
    // Make sure it isn't a child that is triggering the event
    if (event) {
      var goAhead = false
      for (var i=0; i < nodes.length; i++) {
        if (event.target === nodes[i]) {
          goAhead = true
          break
        }
      }
      if (!goAhead) return
    }

    if (done || (event !== undefined && --nrofTransitionsLeft > 0)) {
      return
    }
    done = true
    rootNode.classList.remove('InfernoAnimation-active')
    
    /**
     * Perform cleanup
     */ 
    rootNode.removeEventListener(transitionEndName, onTransitionEnd, false)
    callback && callback()
  }
  rootNode.addEventListener(transitionEndName, onTransitionEnd, false)
  // Fallback if transitionend fails
  !window.debugAnimations && setTimeout(onTransitionEnd, Math.round(maxDuration * 1000) + 100) 
}
