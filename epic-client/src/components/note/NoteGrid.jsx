import React from 'react';
import * as PropTypes from "prop-types";
import ModelTableHeaders from "../app/model/ModelTableHeaders";
import {customerNoteFields} from "../app/model/helpers/fields";
import ModelViewRow from "../app/model/ModelViewRow";

const NoteGrid = props => {
    const { notes, users, quote } = props;
    let notesToUse = notes;
    if (quote) notesToUse = notes.filter(note => note.quote === quote.id);
    return <div className="grid-container">
        <div className='grid'>
            <div key="bikeReviewHeaders" className="grid-row grid-row--header">
                <ModelTableHeaders modelFields={customerNoteFields} lockFirstColumn={true}/>
            </div>
            {notesToUse.map(note => <div className={`grid-row`} key={`note${note.id}`}>
                <ModelViewRow
                    modelFields={customerNoteFields}
                    model={note}
                    users={users}
                    lockFirstColumn={true}
                />
            </div>)}
        </div>
    </div>;
};
NoteGrid.propTypes = {
    notes: PropTypes.array.isRequired,
    users: PropTypes.array.isRequired,
    quote: PropTypes.object,
};
export default NoteGrid;