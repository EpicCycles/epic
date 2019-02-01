import React from 'react';
import {Route} from 'react-router-dom'
import ReactModal from 'react-modal';

import Home from '../home'
import CustomerList from '../customer/CustomerListContainer'
import Framework from '../framework/FrameworkContainer'
import NotFound from "../404";
import CustomerEditContainer from "../customer/CustomerEditContainer";
import HeaderContainer from "./HeaderContainer";
import BrandsContainer from "../brand/BrandsContainer";
import BikeUploadContainer from "../bike/BikeUploadContainer";
import BikeReviewListContainer from "../bike/BikeReviewListContainer";
import BikeReviewContainer from "../bike/BikeReviewContainer";
import SupplierProductUploadContainer from "../supplierProduct/SupplierProductUploadContainer";
import SupplierProductReviewContainer from "../supplierProduct/SupplierProductReviewContainer";
import Login from "../user/LoginContainer";
import UserDetailChangeContainer from "../user/UserDetailChangeContainer";
import PasswordChangeContainer from "../user/PasswordChangeContainer";

ReactModal.setAppElement('#root');
const App = () => (
    <div>
        <HeaderContainer/>
        <main className="grid-container"
              style={{ height: (window.innerHeight - 50) + "px", width: window.innerWidth + "px" }}>
            <Route exact path="/" component={Home}/>
            <Route exact path="/404" component={NotFound}/>
            <Route exact path="/login" component={Login}/>
            <Route exact path="/change-user-detail" component={UserDetailChangeContainer}/>
            <Route exact path="/change-password" component={PasswordChangeContainer}/>
            <Route exact path="/customer" component={CustomerEditContainer}/>
            <Route exact path="/customer-search" component={CustomerList}/>
            <Route exact path="/framework" component={Framework}/>
            <Route exact path="/brands" component={BrandsContainer}/>
            <Route exact path="/bike-upload" component={BikeUploadContainer}/>
            <Route exact path="/bike-review-list" component={BikeReviewListContainer}/>
            <Route exact path="/bike-review" component={BikeReviewContainer}/>
            <Route exact path="/product-upload" component={SupplierProductUploadContainer}/>
            <Route exact path="/product-review" component={SupplierProductReviewContainer}/>
        </main>
    </div>
);
export default App;