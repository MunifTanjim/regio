import { Router } from '@reach/router'
import React, { lazy, Suspense } from 'react'
import { Provider } from 'react-redux'

const App = lazy(() => import('./App'))
const Print = lazy(() => import('./Print'))

const Lazy = ({ LazyComponent, ...props }) => (
  <Suspense fallback={<div>Loading...</div>}>
    <LazyComponent {...props} />
  </Suspense>
)

const Root = ({ store }) => (
  <Provider store={store}>
    <Router primary={false}>
      <Lazy default path="/*" LazyComponent={App} />
      <Lazy path="/print/*" LazyComponent={Print} />
    </Router>
  </Provider>
)

export default Root
