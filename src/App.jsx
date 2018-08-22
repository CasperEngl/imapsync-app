import React from 'react';
import { Provider } from 'react-redux';
import HttpsRedirect from 'react-https-redirect';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { save, load } from 'redux-localstorage-simple';
import { Container } from 'reactstrap';

import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Transfers from './components/Transfers';
import ActionBar from './components/ActionBar';

import rootReducer from './reducers/rootReducer';

const middleware = [thunk];

export const store = createStore(
  rootReducer,
  load(),
  composeWithDevTools(applyMiddleware(...middleware, save())),
);

const App = () => (
  <Provider store={store}>
    <HttpsRedirect>
      <Navigation />
      <Hero />
      <Container>
        <ActionBar />
        <Transfers />
      </Container>
    </HttpsRedirect>
  </Provider>
);

export default App;
