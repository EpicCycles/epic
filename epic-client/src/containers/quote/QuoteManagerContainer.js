import {connect} from 'react-redux'
import {getFramework} from "../../state/actions/framework";
import {getBrandsAndSuppliers, saveBrands} from "../../state/actions/core";
import {getFrameList} from "../../state/actions/bike";
import {
    clearCustomerState, createCustomer, deleteCustomer, deleteCustomerAddress, deleteCustomerPhone,
    getCustomer,
    getCustomerList,
    getCustomerListPage,
    removeCustomer, saveCustomer, saveCustomerAddress, saveCustomerPhone
} from "../../state/actions/customer";
import {createNote, deleteNote, removeNote, saveNote} from "../../state/actions/note";
import QuoteManager from "../../components/quote/QuoteManager";
import {listParts} from "../../state/actions/part";

const mapStateToProps = ({ bike, core, customer, framework, note, part, quote }) => {
    return {
        bikes: bike.bikes,
        bikeParts: bike.bikeParts,
        brands: core.brands,
        suppliers: core.suppliers,
        sections: framework.sections,
        parts: part.parts,
        frames: bike.frames,
        searchParams: customer.searchParams,
        customers: customer.customers,
        customer: customer.customer,
        notes: note.notes,
        quotes: quote.quotes,
        quoteId: quote.quoteId,
        quoteParts: quote.quoteParts,
        isLoading: (customer.isLoading, core.isLoading || bike.isLoading || framework.isLoading, quote.isLoading)
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
    createCustomer, saveCustomer, deleteCustomer, removeCustomer,
    createNote, saveNote, removeNote, deleteNote,
    saveCustomerPhone, deleteCustomerPhone,
    saveCustomerAddress, deleteCustomerAddress
};
export default connect(mapStateToProps, mapDispatchToProps)(QuoteManager)