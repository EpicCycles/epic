import {combineReducers} from "redux";
import {routerReducer} from "react-router-redux";
import customer from "./customer";
import note from "./note";
import user from "./user";
import application from "./application";

const reducers = combineReducers({
    customer,
    application,
    note,
    user,
    routing: routerReducer
});

export default reducers;