import React from 'react'
import {Dimmer, Loader} from 'semantic-ui-react'
import ErrorDismissibleBlock from "../../common/ErrorDismissibleBlock";
import CustomerDetailEdit from "./CustomerDetailEdit";
import NoteCreate from "../note/NoteCreate";

class CustomerEdit extends React.Component {
    // add a key to state for each block to force reload on change
    state = {
        note_key: 0,
        customer_key: 1
    };

    saveOrCreateCustomerNote = (note_text, customer_visible) => {
        if (this.props.note && this.props.note.id) {
            let noteToSave = this.props.note;
            noteToSave.note_text = note_text;
            noteToSave.customer_visible = customer_visible;
            this.props.saveNote(noteToSave);
        }
        else {
            const newNote = {
                customer: this.props.customer.id,
                note_text: note_text,
                customer_visible: customer_visible
            };
            this.props.createNote(newNote);
        }
        this.updateNoteKey()
    };

    updateNoteKey = () => {
        if (this.props.note && this.props.note.id) {
            this.setState({note_key: this.props.note.id});
        }
        else {
            this.setState({note_key: 0});
        }
    };

    render() {
        const {removeCustomerError, removeNoteError, acceptCustomerChanges, isLoading, customer, error, note, noteError, removeNote, deleteNote} = this.props;
        const {note_key} = this.state;
        const customer_key = (customer && customer.id) ? customer.id : 0;
        return (
            <div id="customer-edit">
                <h1>Edit Customer</h1>
                {error &&
                <ErrorDismissibleBlock error={error} removeError={removeCustomerError}/>
                }

                <CustomerDetailEdit customer={customer ? customer : {}}
                                    acceptCustomerChanges={acceptCustomerChanges}
                                    key={`detail${customer_key}`}
                />
                {(customer && customer.id) &&
                <NoteCreate saveNote={this.saveOrCreateCustomerNote} removeNoteError={removeNoteError} note={note}
                            key={`detail${note_key}`}
                            noteError={noteError} removeNote={removeNote} deleteNote={deleteNote}
                            updateNoteKey={this.updateNoteKey}
                />}

                {isLoading &&
                <Dimmer active inverted>
                    <Loader content='Loading'/>
                </Dimmer>
                }
            </div>
        )
    }
}

export default CustomerEdit;
