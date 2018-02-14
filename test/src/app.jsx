import { render } from 'inferno'
import { BrowserRouter, Route, Link } from 'inferno-router'

import AnimatePage from './AnimatePage.jsx'
import AnimatedTagPage from './AnimatedTagPage.jsx'
import CrossFadePage from './CrossFadePage.jsx'
import CrossFadeNestedPage from './CrossFadeNestedPage.jsx'

window.debugAnimations = true

function App () {
  return (
    <BrowserRouter>
      <div>
        <div className="Menu">
          <Link to="/animate">Animate</Link>
          <Link to="/animatedTag">Animated Tag</Link>
          <Link to="/crossfade">Cross Fade</Link>
          <Link to="/crossfade-nested">Cross Fade Nested</Link>
        </div>
        <div className="Content">
          <Route exact path="/" component={ AnimatePage }/>
          <Route path="/animate" component={ AnimatePage }/>
          <Route path="/animatedTag" component={ AnimatedTagPage }/>
          <Route path="/crossfade" component={ CrossFadePage }/>
          <Route path="/crossfade-nested" component={ CrossFadeNestedPage }/>
        </div>
      </div>
    </BrowserRouter>
  )
}

if (typeof window !== 'undefined') {
  render(<App />, document.getElementById('app'))
}
