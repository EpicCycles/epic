import React from 'react'
import TabbedView from "../../common/TabbedView";
import * as PropTypes from "prop-types";
import {doWeHaveObjects} from "../../helpers/utils";
import QuoteCustomer from "./QuoteCustomer";

const tabs = [
    "Customer",
    "Bike",
    "Quote List",
    "Quote detail",
];
const initialState = {
    tab: 0,
};

class QuoteManager extends React.Component {
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
        if (newTab !== this.state.tab) this.setState({ tab: newTab })
    };

    render() {
        const { tab } = this.state;
        const {
            getCustomer,
            getCustomerList,
            getCustomerListPage,
            isLoading,
            customers,
            customerId,
            addresses,
            phones,
            count,
            next,
            previous,
            searchParams,
            deleteCustomer,
            deleteNote,
            saveNote,
            createNote,
            deleteCustomerPhone, saveCustomerPhone,
            saveCustomerAddress, deleteCustomerAddress,
            saveCustomer, createCustomer
        } = this.props;
        return <div className='page-content'>
            <TabbedView tabs={tabs} changeTab={this.changeCurrentTab} currentTab={tab}/>
            {(tab === 0) && <QuoteCustomer
                getCustomerList={getCustomerList}
                getCustomerListPage={getCustomerListPage}
                getCustomer={getCustomer}
                searchParams={searchParams}
                isLoading={isLoading}
                customers={customers}
                count={count}
                next={next}
                previous={previous}
                addresses={addresses}
                phones={phones}
                deleteCustomer={deleteCustomer}
                customerId={customerId}
                deleteNote={deleteNote}
                saveNote={saveNote}
                createNote={createNote}
                deleteCustomerPhone={deleteCustomerPhone}
                saveCustomerPhone={saveCustomerPhone}
                saveCustomerAddress={saveCustomerAddress}
                deleteCustomerAddress={deleteCustomerAddress}
                saveCustomer={saveCustomer}
                createCustomer={createCustomer}
                data-test="customer-tab"
            />}
            {(tab === 1) && <h1 data-test="bike-tab">Bike</h1>}
            {(tab === 2) && <h1 data-test="quote-list-tab">QUote List</h1>}
            {(tab === 3) && <h1 data-test="quote-detail-tab">Quote detail</h1>}
        </div>
    };
}

QuoteManager.defaultProps = {
    bikes: [],
    bikeParts: [],
    suppliers: [],
    frames: [],
    customers: [],
    addresses: [],
    phones: [],
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
    searchParams: PropTypes.object,
    count: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    next: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    previous: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    customerId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    addresses: PropTypes.array,
    phones: PropTypes.array,
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
    createNote: PropTypes.func.isRequired,
    saveNote: PropTypes.func.isRequired,
    deleteNote: PropTypes.func.isRequired,
    saveCustomerPhone: PropTypes.func.isRequired,
    deleteCustomerPhone: PropTypes.func.isRequired,
    saveCustomerAddress: PropTypes.func.isRequired,
    deleteCustomerAddress: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
};

export default QuoteManager;