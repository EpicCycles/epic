import React, {Fragment} from 'react'
import TabbedView from "../../common/TabbedView";
import * as PropTypes from "prop-types";
import {doWeHaveObjects} from "../../helpers/utils";

const tabs = [
    "Customer" ,
    "Bike" ,
    "Quote List" ,
    "Quote detail" ,
];
const initialState = {
    tab: 0,
};
class QuoteManager  extends React.Component {
    state = initialState;

    componentDidMount() {
        this.checkPropsData();
    };

    checkPropsData = () => {
        if (!this.props.isLoading) this.getData();
    };
    getData = () => {
        let brandsRequired = true;
        let frameworkRequired = true;

        if (doWeHaveObjects(this.props.brands)) brandsRequired = false;
        if (doWeHaveObjects(this.props.sections)) frameworkRequired = false;

          if (brandsRequired) {
            this.props.getBrandsAndSuppliers();
        }
        if (frameworkRequired) {
            this.props.getFramework();
        }
    };
    changeCurrentTab = (newTab) => {
        if (newTab !== this.state.tab) this.setState({tab: newTab})
    };
    render() {
        const { tab } = this.state;
        return <Fragment>
            <TabbedView tabs={tabs} changeTab={this.changeCurrentTab} currentTab={tab}/>
            {(tab === 0) && <h1 data-test="customer-tab">Customer</h1> }
            {(tab === 1) && <h1 data-test="bike-tab">Customer</h1> }
            {(tab === 2) && <h1 data-test="quote-list-tab">Customer</h1> }
            {(tab === 3) && <h1 data-test="quote-detail-tab">Customer</h1> }
        </Fragment>
    };
}

QuoteManager.defaultProps = {
    bikes: [],
    bikeParts: [],
    suppliers: [],
    frames: [],
    customers: [],
    customer: {},
    notes: [],
    parts: [],
    brands: [],
    sections: [],
    quotes: [],
    quoteParts: [],
    isLoading: false,

};

QuoteManager.propTypes = {
    bikes: PropTypes.array,
    bikeParts: PropTypes.array,
    brands: PropTypes.array,
    suppliers: PropTypes.array,
    sections: PropTypes.array,
    parts: PropTypes.array,
    frames: PropTypes.array,
    customers: PropTypes.array,
    notes: PropTypes.array,
    customer: PropTypes.object,
     quotes: PropTypes.array,
     quoteParts: PropTypes.array,
   getBrandsAndSuppliers: PropTypes.func.isRequired,
    saveBrands: PropTypes.func.isRequired,
    getFramework: PropTypes.func.isRequired,
    getFrameList: PropTypes.func.isRequired,
   listParts: PropTypes.func.isRequired,
    getCustomerList: PropTypes.func.isRequired,
    getCustomerListPage: PropTypes.func.isRequired,
    getCustomer: PropTypes.func.isRequired,
    clearCustomerState: PropTypes.func.isRequired,
    createCustomer: PropTypes.func.isRequired,
    saveCustomer: PropTypes.func.isRequired,
    deleteCustomer: PropTypes.func.isRequired,
    removeCustomer: PropTypes.func.isRequired,
    createNote: PropTypes.func.isRequired,
    saveNote: PropTypes.func.isRequired,
    removeNote: PropTypes.func.isRequired,
    deleteNote: PropTypes.func.isRequired,
        saveCustomerPhone: PropTypes.func.isRequired,
    deleteCustomerPhone: PropTypes.func.isRequired,
    saveCustomerAddress: PropTypes.func.isRequired,
    deleteCustomerAddress: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
};

export default QuoteManager;