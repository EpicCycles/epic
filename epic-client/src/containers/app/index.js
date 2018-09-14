import React from 'react';
import {Route} from 'react-router-dom'

import Home from '../home'
import Login from '../user'
import CustomerList from '../customer'
import Framework from '../framework'
import NotFound from "../404";
import CustomerEditContainer from "../customer/CustomerEditContainer";
import HeaderContainer from "./HeaderContainer";

const App = () => (
    <div>
        <HeaderContainer/>
        <main>
            <Route exact path="/" component={Home}/>
            <Route exact path="/404" component={NotFound}/>
            <Route exact path="/login" component={Login}/>
            <Route exact path="/customer" component={CustomerEditContainer}/>
            <Route exact path="/customer-search" component={CustomerList}/>
            <Route exact path="/framework" component={Framework}/>
        </main>

    </div>
);
export default App;