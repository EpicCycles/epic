import React, {Fragment} from 'react';
import TabbedView from "../../common/TabbedView";
import * as PropTypes from "prop-types";
import {doWeHaveObjects, findObjectWithId} from "../../helpers/utils";
import CustomerEdit from "../customer/CustomerEdit";
import {quoteFields} from "./helpers/display";
import QuoteGrid from "./QuoteGrid";
import QuoteDetail from "./QuoteDetail";

const tabs = [
    "Customer",
    "Quote List",
    "Quote detail",
    "Quote history",
    "Bike Quotes"
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
        if (this.props.quoteId) this.setState({tab:2});
    };
    changeCurrentTab = (newTab) => {
        if (newTab !== this.state.tab) {
            if ((newTab === 2) && (!this.props.quoteId)) return;
            this.setState({ tab: newTab });
        }
    };
    editQuote = (quoteId) => {
        this.props.changeQuote(quoteId);
        this.changeCurrentTab(2);
    };


    render() {
        const { tab } = this.state;
        const {
            isLoading,
            customers,
            customerId,
            addresses,
            phones,
            deleteCustomer,
            deleteNote,
            saveNote,
            createNote,
            deleteCustomerPhone, saveCustomerPhone,
            saveCustomerAddress, deleteCustomerAddress,
            saveCustomer,
            quotes,
            quoteId,
            quoteParts,
            brands,
            suppliers,
            bikes,
            notes,
            bikeParts,
            frames,
            parts,
            supplierProducts,
            sections,
            archiveQuote,
            unarchiveQuote,
            changeQuote,
            saveQuotePart,
            deleteQuotePart,
        } = this.props;
        let quote;
        if (quoteId) quote = findObjectWithId(quotes, quoteId);
        return <div className='page-content'>
            <TabbedView tabs={tabs} changeTab={this.changeCurrentTab} currentTab={tab}/>
            {(tab === 0) && <CustomerEdit
                addresses={addresses}
                phones={phones}
                customers={customers}
                deleteCustomer={deleteCustomer}
                isLoading={isLoading}
                customerId={customerId}
                deleteNote={deleteNote}
                saveNote={saveNote}
                createNote={createNote}
                deleteCustomerPhone={deleteCustomerPhone}
                saveCustomerPhone={saveCustomerPhone}
                saveCustomerAddress={saveCustomerAddress}
                deleteCustomerAddress={deleteCustomerAddress}
                saveCustomer={saveCustomer}
                data-test="customer-tab"
            />}
            {(tab === 1) && <Fragment>
                <h1>Quote List</h1>
                <div className='row'>
                    <QuoteGrid
                        displayFields={quoteFields}
                        getQuote={this.editQuote}
                        archiveQuote={archiveQuote}
                        unarchiveQuote={unarchiveQuote}
                        quotes={quotes}
                        customers={customers}
                        brands={brands}
                        bikes={bikes}
                        frames={frames}
                        sections={sections}
                        data-test="quote-list-tab"
                    />
                </div>
            </Fragment>}
            {(quote && tab === 2) && <QuoteDetail
                quote={quote}
                quoteParts={quoteParts}
                bikeParts={bikeParts}
                parts={parts}
                supplierProducts={supplierProducts}
                frames={frames}
                bikes={bikes}
                customers={customers}
                brands={brands}
                suppliers={suppliers}
                sections={sections}
                saveQuote={changeQuote}
                archiveQuote={archiveQuote}
                saveQuotePart={saveQuotePart}
                deleteQuotePart={deleteQuotePart}
                data-test="quote-detail-tab"
            />}
            {(tab === 3) && <h1 data-test="quote-history-tab">Quote History</h1>}
            {(tab === 4) && <h1 data-test="bike-quotes-tab">Bike Quotes</h1>}
        </div>
    };
}

QuoteManager.defaultProps = {
    bikes: [],
    bikeParts: [],
    frames: [],
    addresses: [],
    phones: [],
    notes: [],
    parts: [],
    supplierProducts: [],
    brands: [],
    suppliers: [],
    sections: [],
    quotes: [],
    quoteParts: [],
    isLoading: false,

};

QuoteManager.propTypes = {
    bikes: PropTypes.array,
    bikeParts: PropTypes.array,
    brands: PropTypes.array.isRequired,
    suppliers: PropTypes.array.isRequired,
    sections: PropTypes.array.isRequired,
    parts: PropTypes.array,
    supplierProducts: PropTypes.array,
    frames: PropTypes.array,
    customers: PropTypes.array.isRequired,
    customerId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
    quoteId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    addresses: PropTypes.array,
    phones: PropTypes.array,
    notes: PropTypes.array,
    quotes: PropTypes.array,
    quoteParts: PropTypes.array,
    getBrandsAndSuppliers: PropTypes.func.isRequired,
    saveBrands: PropTypes.func.isRequired,
    getFramework: PropTypes.func.isRequired,
    getFrameList: PropTypes.func.isRequired,
    saveCustomer: PropTypes.func.isRequired,
    deleteCustomer: PropTypes.func.isRequired,
    createNote: PropTypes.func.isRequired,
    saveNote: PropTypes.func.isRequired,
    deleteNote: PropTypes.func.isRequired,
    saveCustomerPhone: PropTypes.func.isRequired,
    deleteCustomerPhone: PropTypes.func.isRequired,
    saveCustomerAddress: PropTypes.func.isRequired,
    deleteCustomerAddress: PropTypes.func.isRequired,
    getQuote: PropTypes.func.isRequired,
    archiveQuote: PropTypes.func.isRequired,
    unarchiveQuote: PropTypes.func.isRequired,
    changeQuote: PropTypes.func.isRequired,
    saveQuotePart: PropTypes.func.isRequired,
    deleteQuotePart: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
};

export default QuoteManager;