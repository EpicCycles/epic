import React from 'react';
import {Route} from 'react-router-dom'

import Home from '../home'
import About from '../about'
import Login from '../user'
import CustomerList from '../customer'
import NotFound from "../404";
import CustomerEditContainer from "../customer/CustomerEditContainer";
import HeaderContainer from "./HeaderContainer";

const App = () => (
    <div>
         <HeaderContainer />
        <main>
            <Route exact path="/" component={Home}/>
            <Route exact path="/404" component={NotFound}/>
            <Route exact path="/login" component={Login}/>
            <Route exact path="/about-us" component={About}/>
            <Route exact path="/customer" component={CustomerEditContainer}/>
            <Route exact path="/customer-search" component={CustomerList}/>
        </main>

    </div>
);
export default App;