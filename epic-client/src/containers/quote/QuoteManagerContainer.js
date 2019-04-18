import {connect} from 'react-redux'
import {saveBrands} from "../../state/actions/core";
import {getFrameList} from "../../state/actions/bike";
import {
    createCustomer,
    deleteCustomer,
    deleteCustomerAddress,
    deleteCustomerPhone,
    saveCustomer,
    saveCustomerAddress,
    saveCustomerPhone
} from "../../state/actions/customer";
import {createNote, deleteNote, saveNote} from "../../state/actions/note";
import QuoteManager from "../../components/quote/QuoteManager";
import {
    archiveQuote,
    changeQuote,
    deleteQuotePart,
    saveQuote,
    saveQuotePart,
    unarchiveQuote
} from "../../state/actions/quote";

const mapStateToProps = ({ bike, core, customer, framework, note, part, quote }) => {
    const {customers, customerId, addresses, phones } = customer;
    const {bikes, bikeParts, frames} = bike;
    const {brands, suppliers }= core;
    const {notes} = note;
    const {quoteId, quotes, quoteParts} = quote;
    const {parts, supplierParts } = part;
    const {sections } = framework;
    return {
        customers, customerId, addresses, phones,
        bikes, bikeParts, frames,
        brands, suppliers,
        quoteId, quotes, quoteParts,
        parts, supplierParts,
        notes, sections,
        isLoading: (customer.isLoading || core.isLoading || bike.isLoading || framework.isLoading || quote.isLoading)
    }
};

const mapDispatchToProps = {
    saveBrands,
    getFrameList,
    createCustomer, saveCustomer, deleteCustomer,
    createNote, saveNote, deleteNote,
    saveCustomerPhone, deleteCustomerPhone,
    saveCustomerAddress, deleteCustomerAddress,
    archiveQuote,
    unarchiveQuote,
    changeQuote,
    saveQuote,
    saveQuotePart,
    deleteQuotePart,
};
export default connect(mapStateToProps, mapDispatchToProps)(QuoteManager)