import React, {Fragment} from "react";
import FormTextInput from "../../common/FormTextInput";
import {NEW_ELEMENT_ID} from "../../helpers/constants";
import {Icon} from "semantic-ui-react";
import {BRAND_FIELD, PART_NAME_FIELD, PART_TYPE_FIELD, partFields, TRADE_IN_FIELD} from "../../helpers/models";
import {addFieldToState, checkForChanges, getUpdatedObject, validateData} from "../../helpers/utils";
import BrandSelect from "../brand/BrandSelect";
import PartTypeSelect from "../partType/PartTypeSelect";
import {getNewDataListRequired} from "../../helpers/part_helper";
import PartDataList from "./PartDataList";
//partType = models.ForeignKey(PartType, on_delete=models.CASCADE)
//     brand = models.ForeignKey(Brand, on_delete=models.CASCADE)
//     part_name = models.CharField(max_length=200)
//     trade_in_value =  models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
//     standard = models.BooleanField(default=False)
//     stocked
const initialState = {
    partType: "",
    brand: "",
    part_name: "",
    trade_in_value: "",
    standard: false,
    stocked: false
};

class PartEdit extends React.Component {
    state = initialState;

    componentWillMount() {
        this.setState(this.deriveStateFromProps());
    };

    checkForChanges = (stateBeforeSetting) => {
        const originalPart = this.props.part;

        if (originalPart && (Object.keys(originalPart).length > 0)) {
            return checkForChanges(partFields, originalPart, stateBeforeSetting || this.state)
        } else {
            return checkForChanges(partFields, initialState, stateBeforeSetting || this.state)
        }
    };

    deriveStateFromProps = () => {
        let newState = initialState;
        if (this.props.part) {
            Object.assign(newState, this.props.part);
        }
        this.checkPartDataList(newState);
        return newState;
    };

    handleInputChange = (fieldName, input) => {
        let newState = addFieldToState(this.state, partFields, fieldName, input);

        if (this.checkForChanges(newState)) {
            newState.errors = validateData(partFields, newState);
        }

        this.checkPartDataList(newState);
        this.setState(newState);
    };

    onClickReset = () => {
        const resetState = this.deriveStateFromProps();
        this.setState(resetState);
        this.checkPartDataList(resetState);
    };

    // get a new part list only if this part hasn't got an id
    checkPartDataList(newState) {
        if ((!newState.id) && getNewDataListRequired(props.partDataList, newState.brand, newState.partType)) {
            this.props.getPartDataList(newState.brand, newState.partType);
        }
    }

    saveOrCreatePart = () => {
        const updatedPart = getUpdatedObject(partFields, this.props.part, this.state);
        this.props.savePart(updatedPart);
        if (this.props.closeModal) {
            this.props.closeModal();
        }
    };
    deleteOrRemovePart = () => {
        if (this.state.id) {
            this.props.deletePart(this.state.id);
        }
        this.setState(initialState);
        if (this.props.closeModal) {
            this.props.closeModal();
        }
    };

    render() {
        const { id, partType, part_name, brand, trade_in_value, standard, stocked, errors } = this.state;
        const { closeModal, sections, brands, partDataList, partTypeEditable } = this.props;
        const componentKey = id ? id : NEW_ELEMENT_ID;
        const isChanged = this.checkForChanges();

        return <Fragment>
            {closeModal && <div style={{ width: "100%", textAlign: "right" }}>
                <Icon
                    name="remove"
                    circular
                    link
                    onClick={closeModal}
                />
            </div>}
            <div style={{ width: "100%", textAlign: "left" }}>
                <h2>Edit Part</h2>
                {partTypeEditable && <div className="grid-row">
                    <div className="grid-item--borderless field-label">
                        Part Type
                    </div>
                    <div className="grid-item--borderless">
                        <PartTypeSelect
                            sections={sections}
                            fieldName="partType"
                            onChange={onChange}
                            brandSelected={partType}
                            isEmptyAllowed={true}
                            error={errors[PART_TYPE_FIELD.fieldName]}
                        />
                    </div>
                </div>
                }
                <div className="grid-row">
                    <div className="grid-item--borderless field-label">
                        Brand
                    </div>
                    <div className="grid-item--borderless">
                        <BrandSelect
                            brands={brands}
                            fieldName="brand"
                            onChange={onChange}
                            brandSelected={brand}
                            isEmptyAllowed={true}
                            error={errors[BRAND_FIELD.fieldName]}
                        />
                    </div>
                </div>
                <div className="grid-row">
                    <div className="grid-item--borderless field-label">
                        Part Name
                    </div>
                    <div className="grid-item--borderless">
                        <FormTextInput
                            placeholder="Part name"
                            key={`part_name_${componentKey}`}
                            fieldName={`part_name_${componentKey}`}
                            value={part_name}
                            onChange={this.handleInputChange}
                            error={errors[PART_NAME_FIELD.fieldName]}
                        />
                        <PartDataList
                            dataListId={`part_name_${componentKey}`}
                            partDataList={partDataList}
                        />
                    </div>
                </div>
                <div className="grid-row">
                    <div className="grid-item--borderless field-label">
                        {TRADE_IN_FIELD.header}
                    </div>
                    <div className="grid-item--borderless">
                        <FormTextInput
                            key={`${TRADE_IN_FIELD.fieldName}_${componentKey}`}
                            fieldName={`${TRADE_IN_FIELD.fieldName}_${componentKey}`}
                            value={trade_in_value}
                            onChange={this.handleInputChange}
                            error={errors[TRADE_IN_FIELD.fieldName]}
                            dataType="number"
                        />
                        <PartDataList
                            dataListId={`part_name_${componentKey}`}
                            partDataList={partDataList}
                        />
                    </div>
                </div>
                <div className="grid-row">
                    <div className="grid-item--borderless field-label">
                        Standard part?
                    </div>
                    <div className="grid-item--borderless">
                        <input type="checkbox"
                               name="standard"
                               onChange={() => this.handleInputChange("standard", !standard)}
                               checked={standard ? standard : false}
                        />
                    </div>
                </div>
                {standard && <div className="grid-row">
                    <div className="grid-item--borderless field-label">
                        Stocked part?
                    </div>
                    <div className="grid-item--borderless">
                        <input type="checkbox"
                               name="stocked"
                               onChange={() => this.handleInputChange("stocked", !stocked)}
                               checked={stocked ? stocked : false}
                        />
                    </div>
                </div>
                }
            </div>
            <div style={{ width: "100%", textAlign: "right" }}>
                {isChanged &&
                <Icon id={`reset-part`} name="undo"
                      onClick={this.onClickReset}
                      title="Reset Part details"
                />
                }
                {(isChanged && isValid) &&
                <Icon id={`accept-part`} name="check"
                      onClick={this.saveOrCreatePart}
                      title="Confirm Part Change"
                />
                }
                {(id || isChanged) &&
                <Icon id={`delete-part`} name="trash"
                      onClick={this.deleteOrRemovePart}
                      title="Delete Part"
                />
                }
            </div>
        </Fragment>;
    }
}

export default PartEdit;