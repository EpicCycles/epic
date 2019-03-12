import React from 'react';
import NoteEdit from "../NoteEdit";
import {Icon} from "semantic-ui-react";

describe("NoteEdit tests", () => {
    const note = {
        id: 23,
        note_text: "note text here",
        customer_visible: true
    };
    const noteNoId = {
        note_text: "note text here",
        customer_visible: true,
        changed: true
    };
    it('renders the form text correctly with no note', () => {
        const input = shallow(
            <NoteEdit/>
        );
        expect(input).toMatchSnapshot();
    });
    it('renders the form text correctly with note', () => {
        const input = shallow(
            <NoteEdit note={note}/>
        );
        expect(input).toMatchSnapshot();
    });
    it('renders the form text correctly with note and error', () => {
        const input = shallow(
            <NoteEdit note={note} noteError={"Error with note"}/>
        );
        expect(input).toMatchSnapshot();
    });

    it('shows the buttons when no note and changes are present', () => {
        const saveNote = jest.fn();

        let input = shallow(
            <NoteEdit saveNote={saveNote}/>
        );
        input.instance().handleInputChange('note_text', "big note text");

        expect(input.find(Icon).length).toBe(2);

        input.find("#accept-note").at(0).simulate("click");
        expect(saveNote.mock.calls.length).toBe(1);
    });
    it('shows the buttons when note with id and changes are present', () => {
        const saveNote = jest.fn();
        const deleteNote = jest.fn();
        const removeNote = jest.fn();

        let input = shallow(
            <NoteEdit saveNote={saveNote} note={note} deleteNote={deleteNote}
                      removeNote={removeNote}/>
        );
        expect(input.find(Icon).length).toBe(1);
        input.instance().handleInputChange('note_text', "");

        expect(input.find(Icon).length).toBe(3);

        input.find("#delete-note").at(0).simulate("click");
        expect(deleteNote.mock.calls.length).toBe(1);
    });
    it('shows the buttons when note no id and changes are present', () => {
        const saveNote = jest.fn();
        const deleteNote = jest.fn();
        const removeNote = jest.fn();

        let input = shallow(
            <NoteEdit saveNote={saveNote} note={noteNoId} deleteNote={deleteNote}
                      removeNote={removeNote}/>
        );
        expect(input.find(Icon).length).toBe(2);

        input.instance().handleInputChange('note_text', "");
        expect(input.find(Icon).length).toBe(2);
    });
    it('clears data when no note and reset is clicked', () => {
        const saveNote = jest.fn();

        let input = shallow(
            <NoteEdit saveNote={saveNote}/>
        );
        expect(input.find(Icon).length).toBe(0);

        input.instance().handleInputChange('note_text', "big note text");
        input.instance().handleInputChange('customer_visible', true);
        expect(input.find(Icon).length).toBe(2);

        input.find("#reset-note").at(0).simulate("click");
        expect(input.find(Icon).length).toBe(0);
    });
    it('resets to passed data when note and reset is clicked', () => {
        const saveNote = jest.fn();

        let input = shallow(
            <NoteEdit
                note={note}
                saveNote={saveNote}
            />
        );
        expect(input.find(Icon).length).toBe(1);

        input.instance().handleInputChange('note_text', "big note text");
        input.instance().handleInputChange('customer_visible', true);
        expect(input.find(Icon).length).toBe(3);

        input.find("#reset-note").at(0).simulate("click");
        expect(input.find(Icon).length).toBe(1);
    });
});
