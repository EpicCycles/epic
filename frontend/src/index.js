import React from 'react'
import {applyMiddleware, compose, createStore} from 'redux'
import createSagaMiddleware from 'redux-saga'
import rootSaga from "./state/sagas";
import reducers from "./state/reducers";
import * as ReactDOM from "react-dom";
import App from './containers/app/AppContainer'

import './index.css'
import history from './history'

import {Provider} from "react-redux";
import {Router} from "react-router-dom";

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

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <App/>
        </Router>
    </Provider>,
    target
);