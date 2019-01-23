import React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { save, load } from 'redux-localstorage-simple';
import { Container } from 'reactstrap';

import Header from './components/Header';
import Hero from './components/Hero';
import Transfers from './components/Transfers';
import ActionBar from './components/ActionBar';

import rootReducer from './reducers/rootReducer';

import './index.scss';

const middleware = [thunk];

export const store = createStore(
  rootReducer,
  load(),
  composeWithDevTools(applyMiddleware(...middleware, save())),
);

const App = () => (
  <Provider store={store}>
    <Header />
    <Hero />
    <Container>
      <ActionBar />
      <Transfers />
    </Container>
  </Provider>
);

export default App;
