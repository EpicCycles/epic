import {
    createCustomer,
    saveCustomer,
    deleteCustomer,
    removeCustomer
} from "../../state/actions/customer";
import {connect} from "react-redux";
import CustomerEdit from "./CustomerEdit";
import {createNote, deleteNote, removeNote, saveNote} from "../../state/actions/note";

export default connect(({customer, note}) => ({
    customer: customer.customer,
    note: note.note,
    isLoading: customer.isLoading || note.isLoading
}), {
    createCustomer, saveCustomer, deleteCustomer, removeCustomer,
    createNote, saveNote, removeNote, deleteNote
})(CustomerEdit)