import {connect} from 'react-redux'
import {getFrameList} from "../../state/actions/bike";
import {clearCustomerState, getCustomerList} from "../../state/actions/customer";
import {archiveQuote, clearQuoteState, getQuote, getQuoteList, unarchiveQuote} from "../../state/actions/quote";
import QuoteList from "../../components/quote/QuoteList";
import {getBrandsAndSuppliers} from "../../state/actions/core";

const mapStateToProps = ({ bike, core, customer, framework, note, part, quote }) => {
    return {
        bikes: bike.bikes,
        brands: core.brands,
        suppliers: core.suppliers,
        frames: bike.frames,
        count: customer.count,
        customers: customer.customers,
        next: customer.next,
        previous: customer.previous,
        searchParams: customer.searchParams,
        customerId: customer.customerId,
        notes: note.notes,
        quotes: quote.quotes,
        isLoading: (customer.isLoading || core.isLoading || bike.isLoading || quote.isLoading)
    }
};

const mapDispatchToProps = {
    getBrandsAndSuppliers,
    getFrameList,
    getCustomerList,
    clearCustomerState,
    clearQuoteState,
    getQuoteList,
    getQuote,
    archiveQuote,
    unarchiveQuote,
};
export default connect(mapStateToProps, mapDispatchToProps)(QuoteList)