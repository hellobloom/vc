import React from 'react'
import {BrowserRouter, Switch, Route} from 'react-router-dom'

import {Claim, Home, Issue, Request, Share} from './pages'
import {sitemap} from './sitemap'

const App: React.FC = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path={sitemap.home}>
        <Home />
      </Route>
      <Route exact path={sitemap.issue}>
        <Issue />
      </Route>
      <Route exact path={sitemap.request}>
        <Request />
      </Route>
      <Route exact path={sitemap.claim(':id')}>
        <Claim />
      </Route>
      <Route exact path={sitemap.share(':id')}>
        <Share />
      </Route>
      <Route path="*">Not Found</Route>
    </Switch>
  </BrowserRouter>
)

export default App
