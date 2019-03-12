import React from "react";
import {Icon} from "semantic-ui-react";
import {updateObject} from "../../helpers/utils";
import EditModelPage from "../app/model/EditModelPage";
import {customerNoteFields} from "../app/model/helpers/fields";
import {addFieldToState} from "../app/model/helpers/model";

class NoteEdit extends React.Component {
    state = {};

    componentWillMount() {
        this.setState({ note: updateObject(this.props.note) });
    };


    handleInputChange = (fieldName, input) => {
        const updatedNote = addFieldToState(this.state.note, customerNoteFields, fieldName, input);
        this.setState({ note: updatedNote });
    };

    onClickReset = () => {
        if (this.state.note.id) {
            this.setState({ note: updateObject(this.props.note) });
        } else {
            this.setState({ note: {}});
        }
    };

    render() {
        const { note } = this.state;
        const { note_text, changed } = note;
        const { saveNote, deleteNote } = this.props;

        return <div>
            <EditModelPage
                modelFields={customerNoteFields}
                onChange={this.handleInputChange}
                model={note}
                persistedModel={this.props.note}
            />
            {(note_text || note) &&
            <div className="row align_right">
                {changed &&
                <Icon id={`reset-note`} name="undo"
                      onClick={this.onClickReset}
                      title="Reset Note details"
                />
                }
                {(changed) &&
                <Icon id={`accept-note`} name="check"
                      onClick={() => saveNote(note)}
                      title="Confirm Note Change"/>
                }
                {(note.id) &&
                <Icon id={`delete-note`} name="delete"
                      onClick={() => deleteNote(note.id)}
                      title="Delete Note"/>
                }
            </div>
            }
        </div>
    }
}

NoteEdit.defaultProps = {
    note: {},
};
export default NoteEdit;
