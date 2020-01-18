import React from 'react'
import {BrowserRouter, Switch, Route} from 'react-router-dom'

import {Admin, Home, Claim, Share} from './pages'
import {sitemap} from './sitemap'

const App: React.FC = () => (
  <BrowserRouter>
    <Switch>
      <Route path={sitemap.admin.home}>
        <Switch>
          <Route exact path={sitemap.admin.home}>
            <Admin.Home />
          </Route>
          <Route exact path={sitemap.admin.issue}>
            <Admin.Issue />
          </Route>
          <Route exact path={sitemap.admin.request}>
            <Admin.Request />
          </Route>

          <Route path="*">Not Found</Route>
        </Switch>
      </Route>

      <Route path="*">
        <Switch>
          <Route exact path={sitemap.home}>
            <Home />
          </Route>
          <Route exact path={sitemap.claim(':id')}>
            <Claim />
          </Route>
          <Route exact path={sitemap.share(':id')}>
            <Share />
          </Route>
          <Route path="*">Not Found</Route>
        </Switch>
      </Route>
    </Switch>
  </BrowserRouter>
)

export default App
