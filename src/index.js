import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createStore, applyMiddleware, combineReducers } from 'redux';

import reducer from './reducers/store';
import {reducer as toastrReducer} from 'react-redux-toastr'

import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import registerServiceWorker from './registerServiceWorker';

const store = createStore(combineReducers({default: reducer, toastr: toastrReducer}), applyMiddleware(thunk));

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
registerServiceWorker();
