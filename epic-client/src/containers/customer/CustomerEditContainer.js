import {acceptCustomerChanges, removeCustomerError} from "../../state/actions/customer";
import {connect} from "react-redux";
import CustomerEdit from "./CustomerEdit";
import {createNote, deleteNote, removeNote, removeNoteError, saveNote} from "../../state/actions/note";

export default connect(({ customer, note }) => ({
    customer: customer.customer,
    note: note.note,
    isLoading: customer.isLoading || note.isLoading,
    error: customer.error,
    noteError: note.error
}), {
    removeCustomerError,
    acceptCustomerChanges,
    createNote,
    saveNote,
    removeNote,
    deleteNote,
    removeNoteError
})(CustomerEdit)