/*
eslint

import/extensions: 0,
import/first: 0,
*/

import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/js/bootstrap.min';
import 'font-awesome/css/font-awesome.min.css';
import 'react-perfect-scrollbar/dist/css/styles.css';

import App from './App.jsx';
import { unregister } from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
unregister();
