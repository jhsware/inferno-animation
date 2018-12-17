# inferno-animation
[![gzip size](http://img.badgesize.io/https://unpkg.com/inferno-animation/dist/cjs/index.min.js?compression=gzip)](https://unpkg.com/inferno-animation/dist/cjs/index.min.js)

## Compatibility
inferno-animation 7.x supports Inferno v7

inferno-animation 6.x supports Inferno v6

inferno-animation 5.x supports Inferno v5

inferno-animation 4.x supports Inferno v4

inferno-animation 3.x supports Inferno v3

## About
Library to animate Inferno components on mount and dismount. Also supports cross-fade, where height and/or
width animates from source size to target size.

This lib allows you to animate all css-properties including width and height using css-animations.
Timeouts are automatically calculated based on the provided CSS rules.

IMPORTANT: This lib assumes you have set `box-sizing: border-box;` on the elements being animated!

If the component that is added has `display: none` no height calculations will be performed.

You can animate your components by adding the animation helpers to `componentDidMount` and `componentWillUnmoun` 
or by wrapping your component in the `<Animated />` component.

In lists, unlike `ReactTransitionGroup`, you need to wrap every item to animate them.

To perform a cross-fade you wrap the components in a `<CrossFade />` component.
Note: you can only have one (1) mounting and one (1) unmounting component during a cross-fade. To cross-fade
lists you need to wrap each of them in a container.

Currently tested on (polyfills from https://polyfill.io):
- Chrome/FF/Safari (latest) on macOS 10.12 (Sierra)
- IE10/IE11 on Windows 7
- Edge on Windows 10

Run the visual tests (instructions at end of this document) to see the animations in practice. Enjoy!

## Debuggging animations
There is a setTimeout fallback in case transitions are interrupted to make sure they clean up properly. This
timeout isn't aware of Chrome Devtools animation slowdown feature. In order to debug animations you can disable
these timeouts by setting:

```
window.debugAnimations = true

```

## Animate component on add or remove

Add calls on `componentDidMount` and `componentWillUnmount` to animate a component when it is added or removed.
NOTE: Make sure you set a `key` for the component or it won't be animated properly.

You can use this to animate single components or components in a list.

Both `animateOnAdd` and `animateOnRemove` allow you to animate **width** and **height**.

```JavaScript
import { animateOnAdd, animateOnRemove } from 'inferno-animation'

componentDidMount () {
  animateOnAdd(this, 'PageAnimation')
}

componentWillUnmount () {
  animateOnRemove(this, 'PageAnimation')
}
```

### Passing custom class names and callback
You can optionally pass custom class names to be used during the animation. You can also
pass a callback which is fired when the animations are finished. This is the firing order:

1. add **start**
2. add **active**
3. add **end**, remove **start**
  - the animation plays and when done:
4. remove **active**, remove **end**
5. call optional **callback**
6. if leaving, remove the element

Example:

```JavaScript
import { animateOnAdd, animateOnRemove } from 'inferno-animation'
import { findDOMNode } from 'inferno-extras'

const enterCls = {
  start: 'willEnter',
  active: 'animationActiveClass',
  end: 'didEnterClass'
}
componentDidMount () {
  animateOnAdd(findDOMNode(this), enterCls, (el) => {
    // Element 'el' is now visible
  })
}

const leaveCls = {
  start: 'willLeaveClass',
  active: 'animationActiveClass',
  end: 'didLeaveClass'
}
componentWillUnmount () {
  animateOnRemove(findDOMNode(this), leaveCls, (el) => { 
    // Element 'el' will be removed when this callback has returned
  })
}
```

## Use wrapper to animate children
You can use the prodvided wrapper `Animated` to animate components. It is useful if you want to
reuse a component in different places with separate animations, or when you use other components
that you can't modify.

```JavaScript
import { Animated } from 'inferno-animation'

<Animated key={...} prefix="PageAnimation">
  <MyListItem data={...} />
</Animated>

/* Specify what element to render by passing attribute "el" */
<Animated key={...} el="li" prefix="PageAnimation">
  <MyListItem data={...} />
</Animated>

/* "tag" is an alias for "el" to harmonise with inferno-bootstrap */
<Animated key={...} tag="li" prefix="PageAnimation">
  <MyListItem data={...} />
</Animated>

<Animated key={...} className="Something" prefix="PageAnimation">
  <MyListItem data={...} />
</Animated>
```

When you add and remove the `Animated` container it will animate according to your CSS-rules.

## Define your animations with CSS

```css
.PageAnimation-enter {
  /* Enter animation start state */ 
}

.PageAnimation-enter-active {
  /* Enter animation transitions */
}

.PageAnimation-enter-end {
  /* Enter animation end state */
}

/* ----------------------------- */

.PageAnimation-leave {
  /* Leave animation start state */
}

.PageAnimation-leave-active {
  /* Leave animation transitions */ 
}

.PageAnimation-leave-end {
  /* Leave animation end state */
}
```

A note on animation timings. I use these rules of thumb:

- 0.1s is too fast, brain doesn't really have time to react
- 0.2s gives a sense of smoothness but feels instant
- 0.3s is fast but noticeable
- 0.5s is smooth
- \>0.5s user starts feeling that they are waiting for animation to end, make sure what ever you use it for is worth it

I often combine a fade and height animation with different timings to get a nice result.

### Sample: Animate height and fade-in/out
```scss
.PageAnimation {
    &-leave {
        // Leave animation start state
        // width: auto;
        opacity: 1;
    }

    &-leave-active {
        // Leave animation transitions
        overflow: hidden;
        transition: height 0.3s ease-out, opacity 0.2s ease-in;
    }

    &-leave-end {
        // Leave animation end state
        // width: 0;
        height: 0;
        opacity: 0;
    }

    &-enter {
        // Enter animation start state
        height: 0;
        opacity: 0;
    }

    &-enter-active {
        // Enter animation transitions
        transition: height 0.2s ease-out, opacity 0.5s ease-in;
    }

    &-enter-end {
        // Enter animation end state
        opacity: 1;
    }
}
```

## Cross-fade between components

This example shows how to cross-fade between the components `PageOne` and `PageTwo`. The CrossFade components
adds a class `InfernoAnimation--noAnim` when being mounted to prevent triggering the cross-fade animation on
mount.

```JavaScript
import { CrossFade } from 'inferno-animation'

...

render () {
  return (
    <CrossFade className="CrossFadeContainer" prefix="CrossFade--Animation">
      {this.state.visible === 'one' && <PageOne />}
      {this.state.visible === 'two' && <PageTwo />}
    </CrossFade>
  )
}
```

### Sample cross-fade animation
```css
.CrossFade--Animation-cross-fade-active {
  transition: height .7s ease-out;
}

.CrossFade--Animation-enter,
.CrossFade--Animation-leave-end {
  /* Enter animation start state */
  /* Leave animation end state */
  opacity: 0;
}

.CrossFade--Animation-enter-active,
.CrossFade--Animation-leave-active {
  /* Enter animation transitions */
  /* Leave animation transitions */
  transition: opacity .7s ease-in;
}

.CrossFade--Animation-enter-end,
.CrossFade--Animation-leave {
  /* Enter animation end state */
  /* Leave animation start state */
  opacity: 1;
}
```

### Avoiding jumps at beginning or end of animation
If the content contains text elements you will get strange behaviour due
to how the browser calculates margins. To avoid this, set the top and bottom
margin of the first and last text element to 0. Add those margins to the container
instead.

```css
/* Make sure we don't get jumps att beginning and end of animation */
.CrossFadeContainer :first-child {
  margin-top: 0;
}

.CrossFadeContainer :last-child {
  margin-bottom: 0;
}

.CrossFadeContainer {
  padding: 1em 0;
  overflow-y: hidden;
  background-color: rgba(0,0,255,0.2);
}
/* Jump reset over */
```

### Avoid nested animations causing jumping
If you have animations in the child components they can cause jumping if
the transition times are slower than that of the cross-fade. So we make sure
we override them to get smooth transitions and correct size calculation:

```css
/**
 * Nested animations require some extra rules to avoid jumping around
 */

/* Needed to make sure nested animations don't make the crossfade jump around */
/* TODO: This should perhaps be set with Javascript? */
.CrossFade--Animation-cross-fade-active .InfernoAnimation-active {
  transition: all .7s ease-out;
}
```

Note 1: When a parent element is cross-fading it sets the class `InfernoAnimation--noAnim`
which prevents children from animating.

Note 2: If you have async operations causing your mounting component to mutate, the height and width
calculations might be wrong because they are performed prior to the async operation has
completed.

## Running the tests
1. `$ npm run install && npm build && npm run test-browser`

2. Open test page in browser `http://localhost:8080`
