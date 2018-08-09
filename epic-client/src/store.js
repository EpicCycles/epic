import {applyMiddleware, compose, createStore} from 'redux'
import {routerMiddleware} from 'connected-react-router'
import createSagaMiddleware from 'redux-saga'
import createHistory from 'history/createBrowserHistory'
import rootSaga from "./state/sagas";
import reducers from "./state/reducers";

export const history = createHistory();
const sagaMiddleware = createSagaMiddleware();

const enhancers = [];
const middleware = applyMiddleware(sagaMiddleware, routerMiddleware(history));

if (process.env.NODE_ENV === 'development') {
    const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__

    if (typeof devToolsExtension === 'function') {
        enhancers.push(devToolsExtension())
    }
}

const composedEnhancers = compose(
    middleware,
    ...enhancers
);

const store = createStore(reducers, composedEnhancers);

sagaMiddleware.run(rootSaga);

export default store;