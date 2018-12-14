import {combineReducers} from "redux";
import {routerReducer} from "react-router-redux";
import customer from "./customer";
import note from "./note";
import core from "./core";
import bike from "./bike";
import user from "./user";
import framework from "./framework";
import application from "./application";

const reducers = combineReducers({
    customer,
    application,
    framework,
    note,
    user,
    core,
    bike,
    routing: routerReducer
});

export default reducers;