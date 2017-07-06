# inferno-animation

Library to animate Inferno components on mount and dismount. It allows you to animate all css-properties including
width and height using css-animations. Timeouts are automatically calculated based on the provided CSS rules.

You can use it by adding the animation helpers to `componentDidMount` and `componentWillUnmoun` or by wrapping
your component in the `<Animated />` component.

In lists, unlike `ReactTransitionGroup`, you need to wrap every item to animate them.

Currently tested on Chrome/FF/Safari (latest) on Mac, but target is IE10+.

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

## Use wrapper to animate children
You can use the prodvided wrapper `Animated` to animate components. It is useful if you want to
reuse a component in different places with separate animations, or when you use other components
that you can't modify.

```JavaScript
import { Animated } from 'inferno-animation'

<Animated key={...} prefix="PageAnimation">
  <MyListItem data={...} />
</Animated>

<Animated key={...} el="li" prefix="PageAnimation">
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