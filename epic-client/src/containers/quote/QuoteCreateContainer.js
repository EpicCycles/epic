import {connect} from 'react-redux'
import {getFramework} from "../../state/actions/framework";
import {getBrandsAndSuppliers, saveBrands} from "../../state/actions/core";
import {getFrameList} from "../../state/actions/bike";
import {
    clearCustomerState, createCustomer, deleteCustomer, deleteCustomerAddress, deleteCustomerPhone,
    getCustomer,
    getCustomerList,
    getCustomerListPage,
    saveCustomer, saveCustomerAddress, saveCustomerPhone
} from "../../state/actions/customer";
import {createNote, deleteNote, saveNote} from "../../state/actions/note";
import {listParts} from "../../state/actions/part";
import QuoteCreate from "../../components/quote/QuoteCreate";
import {createQuote} from "../../state/actions/quote";

const mapStateToProps = ({ bike, core, customer, framework, note, part, quote }) => {
    return {
        bikes: bike.bikes,
        bikeParts: bike.bikeParts,
        brands: core.brands,
        suppliers: core.suppliers,
        sections: framework.sections,
        parts: part.parts,
        frames: bike.frames,
         count: customer.count,
    customers: customer.customers,
    next: customer.next,
    previous: customer.previous,
    searchParams: customer.searchParams,
        customerId: customer.customerId,
        notes: note.notes,
        quotes: quote.quotes,
        quoteId: quote.quoteId,
        quoteParts: quote.quoteParts,
        isLoading: (customer.isLoading || core.isLoading || bike.isLoading || framework.isLoading || quote.isLoading)
    }
};

const mapDispatchToProps = {
    getFrameList,
    getCustomerList,
    createQuote,
};
export default connect(mapStateToProps, mapDispatchToProps)(QuoteCreate)