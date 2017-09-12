import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {applyMiddleware, createStore} from 'redux';
import {Provider} from 'react-redux';
import reducer from './reducers/reducers';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import 'bootstrap/dist/css/bootstrap.css';

const store=createStore(
  reducer,
  applyMiddleware(logger, thunk)
);
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
