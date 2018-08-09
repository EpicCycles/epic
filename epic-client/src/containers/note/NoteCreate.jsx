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
        this.setState({note_text: input});
    };
    onClearNote = () => {
        const note_text = this.props.note ? this.props.note.note_text : '';
        this.setState({note_text: note_text});
    };
    changeVisibility = () => {
        const old_visibility = this.state.customer_visible;
        this.setState({customer_visible: !old_visibility});
    };
    onClickReset = () => {
        if (this.props.note) {
            this.setState({
                note_text: this.props.note.note_text,
                customer_visible: this.props.note.customer_visible
            });
        } else {
            this.setState({
                note_text: '',
                customer_visible: false
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
        const {note_text, customer_visible} = this.state;
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
                {note_text &&
                <Icon id={`reset-note`} name="undo"
                      onClick={this.onClickReset}
                      title="Reset Note details"
                />
                }
                {note_text &&
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
