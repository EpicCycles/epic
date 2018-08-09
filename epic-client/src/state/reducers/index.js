import {combineReducers} from "redux";
import {routerReducer} from "react-router-redux";
import customer from "./customer";
import note from "./note";

const reducers = combineReducers({
    customer,
    note,
    routing: routerReducer
});

export default reducers;