import {
    createCustomer,
    saveCustomer,
    deleteCustomer,
    saveCustomerPhone, deleteCustomerPhone, saveCustomerAddress, deleteCustomerAddress
} from "../../state/actions/customer";
import {connect} from "react-redux";
import CustomerEdit from "../../components/customer/CustomerEdit";
import {createNote, deleteNote, saveNote} from "../../state/actions/note";
import {getQuote} from "../../state/actions/quote";

export default connect(({ customer, note, quote, bike, core }) => ({
    customers: customer.customers,
    addresses: customer.addresses,
    phones: customer.phones,
    fittings: customer.fittings,
    customerId: customer.customerId,
    note: note.note,
    notes: note.notes,
    quotes: quote.quotes,
    bikes: bike.bikes,
    frames: bike.frames,
    brands: core.brands,
    isLoading: customer.isLoading || note.isLoading
}), {
    createCustomer, saveCustomer, deleteCustomer,
    createNote, saveNote,  deleteNote,
    saveCustomerPhone, deleteCustomerPhone,
    saveCustomerAddress, deleteCustomerAddress,
    getQuote,
}) (CustomerEdit)