import React from "react";
import FormTextAreaInput from "../../common/FormTextAreaInput";
import {Icon} from "semantic-ui-react";
import ErrorDismissibleBlock from "../../common/ErrorDismissibleBlock";

class NoteCreate extends React.Component {
    state = {
        note_text: '',
        customer_visible: false
    };

    componentWillMount() {
        if (this.props.note) {
            this.setState({
                note_text: this.props.note.note_text,
                customer_visible: this.props.note.customer_visible
            });
        }
    };

    onNoteChanged = (input) => {
        const initial_note_text = this.props.note ? this.props.note.note_text : '';
        const initialVisibility =  this.props.note ? this.props.note.customer_visible : false;
        const isChanged = ((this.state.customer_visible !== initialVisibility) || (input !== initial_note_text));
        this.setState({note_text: input, isChanged: isChanged});
    };
    onClearNote = () => {
        const initial_note_text = this.props.note ? this.props.note.note_text : '';
        const initialVisibility =  this.props.note ? this.props.note.customer_visible : false;
        const isChanged = this.state.customer_visible !== initialVisibility;
        this.setState({note_text: initial_note_text, isChanged: isChanged});
    };
    changeVisibility = () => {
        const new_visibility = ! this.state.customer_visible;
        const initial_note_text = this.props.note ? this.props.note.note_text : '';
        const initialVisibility =  this.props.note ? this.props.note.customer_visible : false;
        const isChanged = ((new_visibility !== initialVisibility) || (this.state.note_text !== initial_note_text));
        this.setState({customer_visible: new_visibility, isChanged: isChanged});
    };
    onClickReset = () => {
        if (this.props.note) {
            this.setState({
                note_text: this.props.note.note_text,
                customer_visible: this.props.note.customer_visible,
                isChanged: false
            });
        } else {
            this.setState({
                note_text: '',
                customer_visible: false,
                isChanged: false
            });
        }
    };
    onClickDelete = () => {
        const {note, deleteNote, removeNote} = this.props;
        if (note && note.id) {
            deleteNote(note);
        }
        else {
            removeNote();
        }
        this.props.updateNoteKey();
    };

    render() {
        const {note_text, customer_visible, isChanged} = this.state;
        const {note, saveNote, noteError, removeNoteError} = this.props;

        return <div>
            {noteError && <ErrorDismissibleBlock error={noteError} removeError={removeNoteError}/>}
            <div className="ui toggle checkbox">
                <input type="checkbox"
                       name="customer_visible"
                       onChange={this.changeVisibility}
                       checked={customer_visible ? customer_visible : false}
                />
                <label>Visible to Customer</label>
            </div>
            <div className="row">
                <FormTextAreaInput
                    placeholder="Add Note here"
                    id="note_text"
                    className="column full"
                    value={note_text}
                    onChange={this.onNoteChanged}
                    onClick={this.onClearNote}
                />
            </div>
            {(note_text || note) &&
            <div className="row align_right">
                {isChanged &&
                <Icon id={`reset-note`} name="undo"
                      onClick={this.onClickReset}
                      title="Reset Note details"
                />
                }
                {(note_text || isChanged) &&
                <Icon id={`accept-note`} name="check"
                      onClick={() => saveNote(note_text, customer_visible)}
                      title="Confirm Note Change"/>
                }
                {note &&
                <Icon id={`delete-note`} name="delete"
                      onClick={this.onClickDelete}
                      title="Delete Note"/>
                }
            </div>
            }
        </div>
    }
}

export default NoteCreate;
