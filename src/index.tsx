/*
eslint

import/extensions: 0,
import/first: 0,
*/

import * as React from 'react';
import { render } from 'react-dom';

import 'jquery/dist/jquery.min.js';
import 'popper.js/dist/popper.min.js';
import 'bootstrap/dist/js/bootstrap.min';
import 'font-awesome/css/font-awesome.min.css';
import 'react-perfect-scrollbar/dist/css/styles.css';

import './index.scss';

import App from './App';
import * as serviceWorker from './serviceWorker';

render(<App />, document.getElementById('root'));
serviceWorker.register();
