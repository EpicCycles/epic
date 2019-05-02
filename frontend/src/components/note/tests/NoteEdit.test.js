import React from 'react';
import toJson from 'enzyme-to-json';
import NoteEdit from '../NoteEdit';

describe('NoteEdit tests', () => {
  const note = {
    id: 23,
    note_text: 'note text here',
    customer_visible: true,
  };
  const noteNoId = {
    note_text: 'note text here',
    customer_visible: true,
    changed: true,
  };
  it('renders the form text correctly with no note', () => {
    const saveNote = jest.fn();
    const deleteNote = jest.fn();
    const removeNote = jest.fn();

    const input = shallow(
      <NoteEdit saveNote={saveNote} deleteNote={deleteNote} removeNote={removeNote} />,
    );
    expect(toJson(input)).toMatchSnapshot();
  });
  it('renders the form text correctly with note', () => {
    const saveNote = jest.fn();
    const deleteNote = jest.fn();
    const removeNote = jest.fn();

    const input = shallow(
      <NoteEdit saveNote={saveNote} note={note} deleteNote={deleteNote} removeNote={removeNote} />,
    );
    expect(toJson(input)).toMatchSnapshot();
  });
  it('clears data when no note and reset is clicked', () => {
    const saveNote = jest.fn();
    const deleteNote = jest.fn();
    const removeNote = jest.fn();
    const input = shallow(
      <NoteEdit
        saveNote={saveNote}
        note={noteNoId}
        deleteNote={deleteNote}
        removeNote={removeNote}
      />,
    );
    expect(input.state('note')).toEqual(noteNoId);

    input.instance().handleInputChange('note_text', 'big note text');
    input.instance().handleInputChange('customer_visible', true);
    expect(input.state('note')).not.toEqual(noteNoId);

    input.instance().onClickReset();
    expect(input.state('note')).toEqual({});
  });
  it('resets to passed data when note and reset is clicked', () => {
    const saveNote = jest.fn();

    const input = shallow(<NoteEdit note={note} saveNote={saveNote} />);
    expect(input.state('note')).toEqual(note);

    input.instance().handleInputChange('note_text', 'big note text');
    input.instance().handleInputChange('customer_visible', true);
    expect(input.state('note')).not.toEqual(note);

    input.instance().onClickReset();
    expect(input.state('note')).toEqual(note);
  });
});
