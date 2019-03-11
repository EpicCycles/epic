import {
    createCustomer,
    saveCustomer,
    deleteCustomer,
    removeCustomer, saveCustomerPhone, deleteCustomerPhone, saveCustomerAddress, deleteCustomerAddress
} from "../../state/actions/customer";
import {connect} from "react-redux";
import CustomerEdit from "../../components/customer/CustomerEdit";
import {createNote, deleteNote, removeNote, saveNote} from "../../state/actions/note";

export default connect(({ customer, note, quote }) => ({
    customers: customer.customers,
    addresses: customer.addresses,
    phones: customer.phones,
    fittings: customer.fittings,
    customerId: customer.customerId,
    note: note.note,
    notes: note.notes,
    quotes: quote.quotes,
    isLoading: customer.isLoading || note.isLoading
}), {
    createCustomer, saveCustomer, deleteCustomer, removeCustomer,
    createNote, saveNote, removeNote, deleteNote,
    saveCustomerPhone, deleteCustomerPhone,
    saveCustomerAddress, deleteCustomerAddress
}) (CustomerEdit)