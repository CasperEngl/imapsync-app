import * as React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { save, load } from 'redux-localstorage-simple';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCross } from '@fortawesome/free-solid-svg-icons'

import ProxyApp from './components/ProxyApp';

import rootReducer from './reducers/rootReducer';

const middleware = [thunk];

export const store = createStore(rootReducer, load(), composeWithDevTools(applyMiddleware(...middleware, save())));

library.add(faCross)

function App() {
	return (
		<Provider store={store}>
			<ProxyApp />
		</Provider>
	);
};

export default App;
