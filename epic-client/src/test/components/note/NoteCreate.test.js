import React from 'react';
import NoteCreate from "../../../components/note/NoteCreate";
import {Icon} from "semantic-ui-react";

describe("NoteCreate tests", () => {
    const note = {
        id: 23,
        note_text: "note text here",
        customer_visible: true
    };
    const noteNoId = {
        note_text: "note text here",
        customer_visible: true
    };
    it('renders the form text correctly with no note', () => {
        const input = shallow(
            <NoteCreate/>
        );
        expect(input).toMatchSnapshot();
    });
    it('renders the form text correctly with note', () => {
        const input = shallow(
            <NoteCreate note={note}/>
        );
        expect(input).toMatchSnapshot();
    });
    it('renders the form text correctly with note and error', () => {
        const input = shallow(
            <NoteCreate note={note} noteError={"Error with note"}/>
        );
        expect(input).toMatchSnapshot();
    });

    it('shows the buttons when no note and changes are present', () => {
        const saveNote = jest.fn();

        let input = shallow(
            <NoteCreate saveNote={saveNote}/>
        );
        input.setState({note_text: "big note text", isChanged:true});

        expect(input.find(Icon).length).toBe(2);

        input.find("#accept-note").at(0).simulate("click");
        expect(saveNote.mock.calls.length).toBe(1);
    });
    it('shows the buttons when note with id and changes are present', () => {
        const saveNote = jest.fn();
        const deleteNote = jest.fn();
        const removeNote = jest.fn();

        let input = shallow(
            <NoteCreate saveNote={saveNote} note={note} deleteNote={deleteNote}
                        removeNote={removeNote}/>
        );
        expect(input.find(Icon).length).toBe(2);

        input.setState({note_text: "", isChanged:true});
        expect(input.find(Icon).length).toBe(3);

        input.find("#delete-note").at(0).simulate("click");
        expect(deleteNote.mock.calls.length).toBe(1);
    });
    it('shows the buttons when note no id and changes are present', () => {
        const saveNote = jest.fn();
        const deleteNote = jest.fn();
        const removeNote = jest.fn();

        let input = shallow(
            <NoteCreate saveNote={saveNote} note={noteNoId} deleteNote={deleteNote}
                        removeNote={removeNote}/>
        );
        expect(input.find(Icon).length).toBe(2);

        input.setState({note_text: "", isChanged:true});
        expect(input.find(Icon).length).toBe(3);

        input.find("#delete-note").at(0).simulate("click");
        expect(deleteNote.mock.calls.length).toBe(0);
        expect(removeNote.mock.calls.length).toBe(1);
    });
    it('clears data when no note and reset is clicked', () => {
        const saveNote = jest.fn();

        let input = shallow(
            <NoteCreate saveNote={saveNote}/>
        );
        expect(input.find(Icon).length).toBe(0);

        input.setState({note_text: "big note text", isChanged:true, customer_visible: true});
        expect(input.find(Icon).length).toBe(2);

        input.find("#reset-note").at(0).simulate("click");
        expect(input.find(Icon).length).toBe(0);
        expect(input.state('note_text')).toBe("");
        expect(input.state('customer_visible')).toBe(false);
        expect(input.state('isChanged')).toBeFalsy();

    });
    it('resets to passed data when note and reset is clicked', () => {
        const saveNote = jest.fn();

        let input = shallow(
            <NoteCreate
                note={note}
                saveNote={saveNote}
            />
        );
        expect(input.find(Icon).length).toBe(2);

        input.setState({note_text: "big note text", isChanged:true, customer_visible: true});
        expect(input.find(Icon).length).toBe(3);

        input.find("#reset-note").at(0).simulate("click");
        expect(input.find(Icon).length).toBe(2);
        expect(input.state('note_text')).toBe(note.note_text);
        expect(input.state('customer_visible')).toBe(note.customer_visible);
        expect(input.state('isChanged')).toBeFalsy();
    });
});
