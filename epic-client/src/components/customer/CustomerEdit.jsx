import React from 'react'
import {Dimmer, Loader} from 'semantic-ui-react'
import CustomerDetailEdit from "./CustomerDetailEdit";
import NoteEdit from "../note/NoteEdit";
import {findObjectWithId, updateObject} from "../../helpers/utils";
import CustomerAddressGrid from "./CustomerAddressGrid";
import {
    createEmptyModelWithDefaultFields,
    getModelKey,
    matchesModel
} from "../app/model/helpers/model";
import CustomerPhoneGrid from "./CustomerPhoneGrid";
import {customerNoteFields} from "../app/model/helpers/fields";

class CustomerEdit extends React.Component {
    state = { note: createEmptyModelWithDefaultFields(customerNoteFields)};

    componentDidUpdate(prevProps) {
        if (this.props.notes !== prevProps.notes) {
            const newNoteIsOnList = this.props.notes.some(note => matchesModel(note, customerNoteFields, this.state.note));
            if (newNoteIsOnList) this.setState({ note: createEmptyModelWithDefaultFields(customerNoteFields) })
        }
    }

    saveOrCreateCustomerNote = (note) => {
        if (note.id) {
            this.props.saveNote(note);
        } else {
            const noteToSave = updateObject(note, { customer: this.props.customerId });
            this.props.createNote(noteToSave);
        }
    };

    render() {
        const { note } = this.state;
        const {
            addresses, phones, notes, quotes, customers,
            deleteCustomer, removeCustomer,
            isLoading, customerId,
            deleteNote,
            deleteCustomerPhone, saveCustomerPhone,
            saveCustomerAddress, deleteCustomerAddress,
            saveCustomer, createCustomer
        } = this.props;
        const customer = findObjectWithId(customers, customerId);
        const note_key = getModelKey(note);
        const customer_key = getModelKey(customer);
        return <div id="customer-edit">
            <h2>Customer</h2>
            <section className="row">
                <div>
                    <CustomerDetailEdit
                        customer={customer}
                        saveCustomer={saveCustomer}
                        createCustomer={createCustomer}
                        removeCustomer={removeCustomer}
                        deleteCustomer={deleteCustomer}
                        componentKey={customer_key}
                        key={`detail${customer_key}`}
                        data-test="edit-customer"
                    />
                    {(customerId) &&
                    <div className="grid-container">
                        <CustomerAddressGrid
                            deleteCustomerAddress={deleteCustomerAddress}
                            saveCustomerAddress={saveCustomerAddress}
                            addresses={addresses}
                            customerId={customerId}
                            data-test="edit-customer-addresses"
                        />
                        <CustomerPhoneGrid
                            deleteCustomerPhone={deleteCustomerPhone}
                            saveCustomerPhone={saveCustomerPhone}
                            customerId={customerId}
                            phones={phones}
                            data-test="edit-customer-phones"
                        />
                    </div>}
                </div>
                <div>
                    {(customerId) &&
                    <NoteEdit
                        saveNote={this.saveOrCreateCustomerNote}
                        key={`detail${note_key}`}
                        note={note}
                        deleteNote={deleteNote}
                        data-test="add-customer-note"
                    />}
                </div>
            </section>

            {isLoading &&
            <Dimmer active inverted>
                <Loader content='Loading'/>
            </Dimmer>
            }
        </div>
    }
}

export default CustomerEdit;
