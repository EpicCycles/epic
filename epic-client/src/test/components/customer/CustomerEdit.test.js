import React from 'react';
import CustomerEdit from "../../../components/customer/CustomerEdit";

it("displays a full customer with extras properly", () => {
    const fullCustomer = {
        id:23,
        first_name: "anna",
        last_name: "Blogs",
        email: "anna@blogs.co.uk",
        addresses: ["1", "2"],
        phones: ["10", "20"],
    };
    const note = {
        id: 278,
        note_text: "a note text",
        customer_visible: true,
        customer: fullCustomer.id
    };
    const component = shallow(
        <CustomerEdit customer={fullCustomer} note={note}/>
    );
    expect(component).toMatchSnapshot();
});
it("displays a new customer (no id) properly", () => {
    const newCustomer = {
        first_name: "anna",
        last_name: "Blogs",
        email: "anna@blogs.co.uk",
        addresses: ["1", "2"],
        phones: ["10", "20"],
    };
    const note={};
    const component = shallow(
        <CustomerEdit customer={newCustomer} note={note}/>
    );
    expect(component).toMatchSnapshot();
});
it("calls create customer when a new customer is saved", () => {
    const saveCustomer = jest.fn();
    const createCustomer = jest.fn();

    const fullCustomer = {
        first_name: "anna",
        last_name: "Blogs",
        email: "anna@blogs.co.uk",
        addresses: ["1", "2"],
        phones: ["10", "20"],
    };
    const note = {
        note_text: "a note text",
        customer_visible: true,
    };
    const component = shallow(
        <CustomerEdit
            customer={fullCustomer}
            note={note}
            createCustomer={createCustomer}
            saveCustomer={saveCustomer}
        />
    );
    component.instance().saveOrCreateCustomer("new first", "new last","email@provider.com");
    expect(saveCustomer.mock.calls.length).toBe(0);
    expect(createCustomer.mock.calls.length).toBe(1);
    expect(createCustomer.mock.calls[0][0].id).toBe(undefined);
    expect(createCustomer.mock.calls[0][0].first_name).toBe("new first");
    expect(createCustomer.mock.calls[0][0].last_name).toBe("new last");
    expect(createCustomer.mock.calls[0][0].email).toBe("email@provider.com");
});
it("calls save customer when an existing customer is saved", () => {
    const saveCustomer = jest.fn();
    const createCustomer = jest.fn();

    const fullCustomer = {
        id:23,
        first_name: "anna",
        last_name: "Blogs",
        email: "anna@blogs.co.uk",
        addresses: ["1", "2"],
        phones: ["10", "20"],
    };
    const note = {
        id: 278,
        note_text: "a note text",
        customer_visible: true,
        customer: fullCustomer.id
    };
    const component = shallow(
        <CustomerEdit
            customer={fullCustomer}
            note={note}
            createCustomer={createCustomer}
            saveCustomer={saveCustomer}
        />
    );
    component.instance().saveOrCreateCustomer("new first", "new last");
    expect(createCustomer.mock.calls.length).toBe(0);
    expect(saveCustomer.mock.calls.length).toBe(1);
    expect(saveCustomer.mock.calls[0][0].id).toBe(fullCustomer.id);
    expect(saveCustomer.mock.calls[0][0].first_name).toBe("new first");
    expect(saveCustomer.mock.calls[0][0].last_name).toBe("new last");
    expect(saveCustomer.mock.calls[0][0].email).toBe(undefined);
});
it("calls create note when a new note is saved", () => {
    const saveCustomer = jest.fn();
    const createCustomer = jest.fn();
    const saveNote = jest.fn();
    const createNote = jest.fn();

    const fullCustomer = {
        id: 234,
        first_name: "anna",
        last_name: "Blogs",
        email: "anna@blogs.co.uk",
        addresses: ["1", "2"],
        phones: ["10", "20"],
    };
    const note = {};
    const component = shallow(
        <CustomerEdit
            customer={fullCustomer}
            note={note}
            createCustomer={createCustomer}
            saveCustomer={saveCustomer}
            saveNote={saveNote}
            createNote={createNote}
        />
    );
    component.instance().saveOrCreateCustomerNote("new note ext", false);
    expect(saveCustomer.mock.calls.length).toBe(0);
    expect(createCustomer.mock.calls.length).toBe(0);
    expect(saveNote.mock.calls.length).toBe(0);
    expect(createNote.mock.calls.length).toBe(1);
    expect(createNote.mock.calls[0][0].id).toBe(undefined);
    expect(createNote.mock.calls[0][0].note_text).toBe("new note ext");
    expect(createNote.mock.calls[0][0].customer_visible).toBe(false);
    expect(createNote.mock.calls[0][0].customer).toBe(fullCustomer.id);
});

it("calls save note when an existing note is saved", () => {
    const saveCustomer = jest.fn();
    const createCustomer = jest.fn();
   const saveNote = jest.fn();
    const createNote = jest.fn();

    const fullCustomer = {
        id: 234,
        first_name: "anna",
        last_name: "Blogs",
        email: "anna@blogs.co.uk",
        addresses: ["1", "2"],
        phones: ["10", "20"],
    };
    const note = {
        id: 278,
        note_text: "a note text",
        customer_visible: true,
        customer: fullCustomer.id
    };
    const component = shallow(
        <CustomerEdit
            customer={fullCustomer}
            note={note}
            createCustomer={createCustomer}
            saveCustomer={saveCustomer}
            saveNote={saveNote}
            createNote={createNote}
        />
    );
    component.instance().saveOrCreateCustomerNote("new note ext", false);
    expect(saveCustomer.mock.calls.length).toBe(0);
    expect(createCustomer.mock.calls.length).toBe(0);
    expect(createNote.mock.calls.length).toBe(0);
    expect(saveNote.mock.calls.length).toBe(1);
    expect(saveNote.mock.calls[0][0].id).toBe(note.id);
    expect(saveNote.mock.calls[0][0].note_text).toBe("new note ext");
    expect(saveNote.mock.calls[0][0].customer_visible).toBe(false);
    expect(saveNote.mock.calls[0][0].customer).toBe(note.customer);
});
