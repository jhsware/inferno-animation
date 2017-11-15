import Inferno from 'inferno'

import { Router, Route, IndexRoute, Link } from 'inferno-router'
import createBrowserHistory from 'history/createBrowserHistory'

import AnimatePage from './AnimatePage.jsx'
import AnimatedTagPage from './AnimatedTagPage.jsx'
import CrossFadePage from './CrossFadePage.jsx'
import CrossFadeNestedPage from './CrossFadeNestedPage.jsx'


function AppLayout (props) {
  return (
    <div>
      <div className="Menu">
        <Link to="/animate">Animate</Link>
        <Link to="/animatedTag">Animated Tag</Link>
        <Link to="/crossfade">Cross Fade</Link>
        <Link to="/crossfade-nested">Cross Fade Nested</Link>
      </div>
      <div className="Content">
        {props.children}
      </div>
    </div>
  )
}

if (typeof window !== 'undefined') {
  const browserHistory = createBrowserHistory()

  const appRoutes = (
    <Router history={ browserHistory }>
      <Route component={ AppLayout }>
        <IndexRoute component={ AnimatePage } />
        <Route path="/animate" component={ AnimatePage } />
        <Route path="/animatedTag" component={ AnimatedTagPage } />
        <Route path="/crossfade" component={ CrossFadePage } />
        <Route path="/crossfade-nested" component={ CrossFadeNestedPage } />
      </Route>
    </Router>
  )
  Inferno.render(appRoutes, document.getElementById('app'))
}