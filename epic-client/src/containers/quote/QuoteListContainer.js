import {connect} from 'react-redux'
import {getFrameList} from "../../state/actions/bike";
import {clearCustomerState, getCustomerList} from "../../state/actions/customer";
import {
    archiveQuote,
    changeQuote,
    clearQuoteState,
    getQuote,
    getQuoteList,
    unarchiveQuote
} from "../../state/actions/quote";
import QuoteList from "../../components/quote/QuoteList";
import {getBrandsAndSuppliers} from "../../state/actions/core";

const mapStateToProps = ({ bike, core, customer, framework, part, quote }) => {
    return {
        bikes: bike.bikes,
        bikeParts: bike.bikeParts,
        brands: core.brands,
        suppliers: core.suppliers,
        frames: bike.frames,
        count: customer.count,
        customers: customer.customers,
        next: customer.next,
        previous: customer.previous,
        searchParams: customer.searchParams,
        customerId: customer.customerId,
        parts: part.parts,
        quotes: quote.quotes,
        quoteParts: quote.quoteParts,
        quoteId: quote.quoteId,
        sections: framework.sections,
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
    changeQuote,
    getQuote,
    archiveQuote,
    unarchiveQuote,
};
export default connect(mapStateToProps, mapDispatchToProps)(QuoteList)