import React, { Fragment } from 'react';
import { Container } from 'reactstrap';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { save, load } from 'redux-localstorage-simple';

import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Transfers from './components/Transfers';
import ActionButtons from './components/ActionButtons';

import rootReducer from './reducers/rootReducer';

const middleware = [thunk];

export const store = createStore(
  rootReducer,
  load(),
  composeWithDevTools(applyMiddleware(...middleware, save())),
);

const App = () => (
  <Provider store={store}>
    <Fragment>
      <Navigation />
      <Hero />
      <Container>
        <ActionButtons />
        <Transfers />
      </Container>
    </Fragment>
  </Provider>
);

export default App;
