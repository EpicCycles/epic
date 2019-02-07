import React, {Fragment} from "react";

import * as PropTypes from "prop-types";
import EditModelPage from "../app/model/EditModelPage";
import {partFields, STOCKED_FIELD} from "../app/model/helpers/fields";
import {Icon} from "semantic-ui-react";
import {isModelValid} from "../app/model/helpers/model";

const PartEditBlock = (props) => {
    const { part, partTypeEditable, brands, sections, componentKey, onChange, savePart, deletePart, resetPart, persistedPart } = props;
    let editFields = partFieldsNoPartType;
    if (partTypeEditable) editFields = partFields;
    if (part.standard || part.stocked) editFields.push(STOCKED_FIELD);
    const isValid = isModelValid(part);

    return <Fragment>
        <h2>{part ? "Selected" : "New"} Part</h2>
        <EditModelPage
            model={part}
            modelFields={editFields}
            onChange={onChange}
            persistedModel={persistedPart}
            componentKey={componentKey}
            brands={brands}
            sections={sections}
        />
        <div style={{ width: "100%", textAlign: "right" }}>
            {part.changed &&
            <Icon id={`reset-part`} name="undo"
                  onClick={resetPart}
                  title="Reset Part details"
            />
            }
            {(part.changed && isValid) &&
            <Icon id={`accept-part`} name="check"
                  onClick={savePart}
                  title="Confirm Part Change"
            />
            }
            {(deletePart && (part.id || isChanged)) &&
            <Icon id={`delete-part`} name="trash"
                  onClick={deletePart}
                  title="Delete Part"
            />
            }
        </div>
    </Fragment>;
};
PartEditBlock.defaultProps = {
    part: {},
    persistedPart: {},
    partTypeEditable: false,
};
PartEditBlock.propTypes = {
    part: PropTypes.object,
    persistedPart: PropTypes.object,
    partTypeEditable: PropTypes.any,
    componentKey: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
    sections: PropTypes.array.isRequired,
    brands: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    savePart: PropTypes.func.isRequired,
    resetPart: PropTypes.func.isRequired,
    deletePart: PropTypes.func.isRequired,
};

export default PartEditBlock;