import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {applyMiddleware, compose, createStore} from 'redux'
import createSagaMiddleware from 'redux-saga'
import rootSaga from "./state/sagas";
import reducers from "./state/reducers";

import "semantic-ui-css/semantic.min.css";

import App from './containers/app'

import './index.css'
import {Router} from "react-router-dom";
import history from './history'

const target = document.querySelector('#root');
const sagaMiddleware = createSagaMiddleware();

const enhancers = [];
const middleware = applyMiddleware(sagaMiddleware);

if (process.env.NODE_ENV === 'development') {
    const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;

    if (typeof devToolsExtension === 'function') {
        enhancers.push(devToolsExtension());
    }
}

const composedEnhancers = compose(
    middleware,
    ...enhancers
);

const store = createStore(reducers, composedEnhancers);
sagaMiddleware.run(rootSaga);

render(
    <Provider store={store}>
        <Router history={history}>
            <App/>
        </Router>
    </Provider>,
    target
);