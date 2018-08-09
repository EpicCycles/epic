import React from 'react';
import {Link, Route} from 'react-router-dom'

import Home from '../home'
import About from '../about'
import Login from '../user'
import CustomerList from '../customer'
import NotFound from "../404";
import CustomerEditContainer from "../customer/CustomerEditContainer";

const App = () => (
    <div>
        <ul className="nav">
            <li className="dropdown">
                <Link className="dropbtn" to="/">Home</Link>
            </li>
            <li className="dropdown">
                <Link className="dropbtn" to="/about-us">About</Link>
            </li>
            <li className="dropdown">
                <p className="dropbtn">Customer</p>
                <div className="dropdown-content">
                    <div className="dropdown-section">Customer</div>
                    <Link className="dropbtn" to="/customer-search">Find Customer</Link>
                </div>
            </li>
        </ul>
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