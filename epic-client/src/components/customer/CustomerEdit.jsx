import React from 'react'
import {Dimmer, Loader} from 'semantic-ui-react'
import CustomerDetailEdit from "./CustomerDetailEdit";
import NoteCreate from "../note/NoteCreate";
import CustomerPhoneEdit from "./CustomerPhoneEdit";
import CustomerAddressEdit from "./CustomerAddressEdit";
import {findObjectWithId, updateObject} from "../../helpers/utils";
import {NEW_ELEMENT_ID} from "../../helpers/constants";
import CustomerAddressGrid from "./CustomerAddressGrid";
import {getModelKey} from "../app/model/helpers/model";
import CustomerPhoneGrid from "./CustomerPhoneGrid";

class CustomerEdit extends React.Component {

    saveOrCreateCustomerNote = (note_text, customer_visible) => {
        if (this.props.note && this.props.note.id) {
            let noteToSave = updateObject(this.props.note, { note_text, customer_visible });
            this.props.saveNote(noteToSave);
        } else {
            const newNote = {
                customer: this.props.customer.id,
                note_text,
                customer_visible,
            };
            this.props.createNote(newNote);
        }
    };

    saveOrCreateCustomer = (customer) => {
        if (customer.id) {
            this.props.saveCustomer(customer);
        } else {
            this.props.createCustomer(customer);
        }
    };

    render() {
        const {
            addresses, phones, notes, quotes, customers,
            deleteCustomer, removeCustomer,
            isLoading, customerId,
            note, removeNote, deleteNote,
            deleteCustomerPhone, saveCustomerPhone,
            saveCustomerAddress, deleteCustomerAddress,
            saveCustomer, createCustomer
        } = this.props;
        const customer = findObjectWithId(customers, customerId);
        const note_key = getModelKey(note);
        const customer_key = getModelKey(customer);
        const newPhoneKey = (customer && customer.newPhone && customer.newPhone.dummyKey) ? customer.newPhone.dummyKey : "new";
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
                    />
                    {(customer && customer.id) &&
                    <div className="grid-container">
                        <CustomerAddressGrid
                            deleteCustomerAddress={deleteCustomerAddress}
                            saveCustomerAddress={saveCustomerAddress}
                            addresses={addresses}
                            customerId={customer.id}
                        />
                        <CustomerPhoneGrid
                            deleteCustomerPhone={deleteCustomerPhone}
                            saveCustomerPhone={saveCustomerPhone}
                            customerId={customer.id}
                            phones={phones}
                        />
                    </div>}
                </div>
                <div>
                    {(customer && customer.id) &&
                    <NoteCreate saveNote={this.saveOrCreateCustomerNote} note={note}
                                key={`detail${note_key}`}
                                removeNote={removeNote} deleteNote={deleteNote}
                                updateNoteKey={this.updateNoteKey}
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
