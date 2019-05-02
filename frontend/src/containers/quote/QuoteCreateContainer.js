import {connect} from 'react-redux'
import {getFrameList} from "../../state/actions/bike";
import {getCustomerList,} from "../../state/actions/customer";
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