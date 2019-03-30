import {connect} from 'react-redux'
import {getFramework} from "../../state/actions/framework";
import {getBrandsAndSuppliers, saveBrands} from "../../state/actions/core";
import {getFrameList} from "../../state/actions/bike";
import {
    clearCustomerState,
    createCustomer,
    deleteCustomer,
    deleteCustomerAddress,
    deleteCustomerPhone,
    getCustomer,
    getCustomerList,
    getCustomerListPage,
    saveCustomer,
    saveCustomerAddress,
    saveCustomerPhone
} from "../../state/actions/customer";
import {createNote, deleteNote, saveNote} from "../../state/actions/note";
import QuoteManager from "../../components/quote/QuoteManager";
import {listParts} from "../../state/actions/part";

const mapStateToProps = ({ bike, core, customer, framework, note, part, quote }) => {
    const {customers, customerId, addresses, phones } = customer;
    const {bikes, bikeParts, frames} = bike;
    const {brands, suppliers }= core;
    const {notes} = note;
    const{quoteId, quotes, quoteParts} = quote;
    const {parts, supplierParts } = part;
    return {
        customers, customerId, addresses, phones,
        bikes, bikeParts, frames,
        brands, suppliers,
        quoteId, quotes, quoteParts,
        parts, supplierParts,
        isLoading: (customer.isLoading || core.isLoading || bike.isLoading || framework.isLoading || quote.isLoading)
    }
};

const mapDispatchToProps = {
    getBrandsAndSuppliers,
    saveBrands,
    getFramework,
    getFrameList,
    listParts,
    getCustomerList,
    getCustomerListPage,
    getCustomer,
    clearCustomerState,
    createCustomer, saveCustomer, deleteCustomer,
    createNote, saveNote, deleteNote,
    saveCustomerPhone, deleteCustomerPhone,
    saveCustomerAddress, deleteCustomerAddress
};
export default connect(mapStateToProps, mapDispatchToProps)(QuoteManager)