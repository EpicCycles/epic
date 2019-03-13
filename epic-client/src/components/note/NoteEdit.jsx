import React from "react";
import {updateObject} from "../../helpers/utils";
import EditModelPage from "../app/model/EditModelPage";
import {customerNoteFields} from "../app/model/helpers/fields";
import {addFieldToState, getModelKey} from "../app/model/helpers/model";
import ModelEditIcons from "../app/model/ModelEditIcons";

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
        const { saveNote, deleteNote } = this.props;

        return <div>
            <EditModelPage
                modelFields={customerNoteFields}
                onChange={this.handleInputChange}
                model={note}
                persistedModel={this.props.note}
            />
            <div className="row align_right">
                <ModelEditIcons
                    componentKey={getModelKey(note)}
                    model={note}
                    modelDelete={deleteNote}
                    modelReset={this.onClickReset}
                    modelSave={saveNote}
                />
            </div>
        </div>
    }
}

NoteEdit.defaultProps = {
    note: {},
};
export default NoteEdit;
