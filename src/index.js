export { default as Animated } from './Animated'
export { default as CrossFade } from './CrossFade'
export { animateOnRemove, animateOnAdd } from './animatedComponent'
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

export const utils = {
  addClassName,
  animationIsRunningOnParent,
  removeClassName,
  registerTransitionListener,
  forceReflow,
  clearDimensions,
  getDimensions,
  setDimensions,
  setDisplay
}
