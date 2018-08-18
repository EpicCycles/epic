import {combineReducers} from "redux";
import {routerReducer} from "react-router-redux";
import customer from "./customer";
import note from "./note";
import user from "./user";

const reducers = combineReducers({
    customer,
    note,
    user,
    routing: routerReducer
});

export default reducers;