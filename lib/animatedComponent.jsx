import { cloneVNode } from 'inferno'

export const animateOnRemove = function (component, animationName) {
  // 1. Clone DOM node, inject it and hide original
  const domEl = component._vNode.dom
  const clone = domEl.cloneNode(true)

  const height = domEl.clientHeight
  const width = domEl.clientWidth

  clone.classList.add(animationName + '-leave')
  clone.style.height = height + 'px'
  clone.style.width = width + 'px'

  // Leaving original element so it can be removed in the normal way
  domEl.style['display'] = 'none'
  domEl.insertAdjacentElement('beforebegin', clone)

  // 2. Set an animation listener, code at end
  var done = false
  var nrofTransitionsLeft
  const onTransitionEnd = (event) => {
    if (event !== undefined && nrofTransitionsLeft > 0) {
      nrofTransitionsLeft--
      return
    }
    if (done) return
    done = true
    // 5. Remove the element
    // Note: If I don't declare an anonymous function immediately here this callback isn't called!
    // const parent = clone.parentElement
    // parent.removeChild(clone)
    // Why does inferno use removeChild?
    clone.remove()
    // console.log('----- removed')
  }

  clone.addEventListener("transitionend", onTransitionEnd, false)
  // 3. Activate transitions
  clone.classList.add(animationName + '-leave-active')

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
    clone.classList.add(animationName + '-leave-end')
    clone.classList.remove(animationName + '-leave')
    clone.style.height = clone.style.width = ''
  }, 5)
}

export const animateOnAdd = function (component, animationName) {
  const node = component._vNode.dom

  // 1. Get height and set start of animation
  const height = node.clientHeight
  const width = node.clientWidth
  node.classList.add(animationName + '-enter')

  // 2. Set an animation listener, code at end
  var done = false
  var nrofTransitionsLeft
  const onTransitionEnd = (event) => {
    if (event !== undefined && nrofTransitionsLeft > 0) {
      nrofTransitionsLeft--
      return
    }
    if (done) return
    done = true
    // 5. Remove the element
    // Note: If I don't declare an anonymous function immediately here this callback isn't called!
    node.style.height = node.style.width = ''
    node.classList.remove(animationName + '-enter-active')
    node.classList.remove(animationName + '-enter-end')
    // console.log('----- added')
  }
  node.addEventListener("transitionend", onTransitionEnd, false)
  const dummy = node.clientHeight

  // 3. Activate transition
  node.classList.add(animationName + '-enter-active')

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
    node.style.height = height + 'px'
    node.style.width = width + 'px'
    node.classList.add(animationName + '-enter-end')
    node.classList.remove(animationName + '-enter')
  }, 5)
}
