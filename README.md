# inferno-animation

Library of animation helpers for Inferno components

# Animate component on add or remove

Add calls on `componentDidMount` and `componentWillUnmount` to animate a component when it is added or removed.
NOTE: Make sure you set a `key` for the component or it won't be animated properly.

You can use this to animate single components or components in a list.

```JavaScript

  import { animateOnAdd, animateOnRemove } from inferno-animation

  componentDidMount () {
    animateOnAdd(this, 'PageAnimation')
  }

  componentWillUnmount () {
    animateOnRemove(this, 'PageAnimation')
  }
```

Define your animations in CSS.

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