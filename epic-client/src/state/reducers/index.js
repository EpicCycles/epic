import {combineReducers} from "redux";
import {routerReducer} from "react-router-redux";
import customer from "./customer";
import note from "./note";
import user from "./user";
import framework from "./framework";
import application from "./application";

const reducers = combineReducers({
    customer,
    application,
    framework,
    note,
    user,
    routing: routerReducer
});

export default reducers;