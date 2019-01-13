import React, {Fragment} from 'react'
import {Dimmer, Loader} from 'semantic-ui-react'
import CustomerDetailEdit from "./CustomerDetailEdit";
import NoteCreate from "../note/NoteCreate";
import CustomerPhoneEdit from "./CustomerPhoneEdit";
import CustomerAddressEdit from "./CustomerAddressEdit";

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
    };

    saveOrCreateCustomer = (first_name, last_name, email) => {
        if (this.props.customer && this.props.customer.id) {
            let customerToSave = this.props.customer;
            customerToSave.first_name = first_name;
            customerToSave.last_name = last_name;
            customerToSave.email = email;
            this.props.saveCustomer(customerToSave);
        }
        else {
            const newCustomer = {
                first_name: first_name,
                last_name: last_name,
                email: email
            };
            this.props.createCustomer(newCustomer);
        }
    };

    render() {
        const {
            deleteCustomer, removeCustomer,
            isLoading, customer,
            note, removeNote, deleteNote,
            deleteCustomerPhone, saveCustomerPhone,
            saveCustomerAddress, deleteCustomerAddress
        } = this.props;
        const note_key = (note && note.id) ? note.id : 0;
        const customer_key = (customer && customer.id) ? customer.id : 0;
        const newAddressKey = (customer && customer.newAddress && customer.newAddress.dummyKey) ?  customer.newAddress.dummyKey : "new";
        const newPhoneKey = (customer && customer.newPhone && customer.newPhone.dummyKey) ?  customer.newPhone.dummyKey : "new";
        return <div id="customer-edit">
            <h2>Customer</h2>
            <section className="row">
                <div>
                    <CustomerDetailEdit customer={customer ? customer : {}}
                                        acceptCustomerChanges={this.saveOrCreateCustomer}
                                        removeCustomer={removeCustomer}
                                        deleteCustomer={deleteCustomer}
                                        key={`detail${customer_key}`}
                    />
                    {(customer && customer.id) &&
                    <Fragment>
                        <h3>Customer Addresses</h3>
                        <div
                        key='partReviewGrid'
                        className="grid">
                            <CustomerAddressEdit
                                key={`editNewAddress${newAddressKey}`}
                                customerAddress={customer.newAddress ? customer.newAddress : {}}
                                customerId={customer.id}
                                saveCustomerAddress={saveCustomerAddress}
                                deleteCustomerAddress={deleteCustomerAddress}
                            />
                            {customer.addresses && customer.addresses.map((address) => {
                                return <CustomerAddressEdit
                                    key={`editAddress${address.id}`}
                                    customerId={customer.id}
                                    saveCustomerAddress={saveCustomerAddress}
                                    deleteCustomerAddress={deleteCustomerAddress}
                                    customerAddress={address}
                                />
                            })}
                        </div>
                        <h3>Customer Phone</h3>
                        <table>
                            <tbody>
                            <CustomerPhoneEdit
                                key={`editNewPhone${newPhoneKey}`}
                                customerId={customer.id}
                                saveCustomerPhone={saveCustomerPhone}
                                deleteCustomerPhone={deleteCustomerPhone}
                                customerPhone={customer.newPhone}
                            />
                            {customer.phones && customer.phones.map((phone) => {
                                return <CustomerPhoneEdit
                                    key={`editPhone${phone.id}`}
                                    customerId={customer.id}
                                    saveCustomerPhone={saveCustomerPhone}
                                    deleteCustomerPhone={deleteCustomerPhone}
                                    customerPhone={phone}
                                />
                            })}
                            </tbody>
                        </table>
                    </Fragment>}
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
