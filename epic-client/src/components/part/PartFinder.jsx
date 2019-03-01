import React from 'react'
import * as PropTypes from "prop-types";

import PartTypeSelect from "../partType/PartTypeSelect";
import {findObjectWithKey, updateObject, updateObjectWithSelectionChanges} from "../../helpers/utils";
import BrandSelect from "../brand/BrandSelect";
import FormTextInput from "../../common/FormTextInput";
import Icon from "semantic-ui-react/dist/commonjs/elements/Icon/Icon";
import PartSelect from "./PartSelect";
import {partFields} from "../app/model/helpers/fields";
import {addFieldToState, getComponentKey} from "../app/model/helpers/model";
import {getModelFields, partReadyToUse} from "./helpers/part";
import EditModelPage from "../app/model/EditModelPage";
import PartSearch from "./PartSearch";

class PartFinder extends React.Component {
    componentWillMount() {
        this.setState(this.deriveStateFromProps());
    };

    deriveStateFromProps() {
        const { partType, part } = this.props;
        let partTypeSelected = partType;
        let brandSelected;
        if (part) {
            partTypeSelected = part.partType;
            brandSelected = part.brand;
        }
        this.setState({
            partTypeSelected,
            brandSelected,
            part,
            persistedPart: part,
        })
    }

    updateStateWithSelectionChanges = (fieldName, value) => {
        this.setState(updateObjectWithSelectionChanges(this.state, fieldName, value));
    };

    updatePartFieldsInState = (fieldName, value) => {
        const part = addFieldToState(this.state.part, partFields, fieldName, value);
        this.updateStateWithSelectionChanges('part', part);
    };

    findParts = () => {
        const { partTypeSelected, brandSelected, searchPartName, searchStandard, searchStocked } = this.state;
        this.props.findParts({
            partType: partTypeSelected,
            partName: searchPartName,
            brand: brandSelected,
            standard: searchStandard,
            stocked: searchStocked,
        })
    };

    changePartViewed = (fieldName, partId) => {
        const part = findObjectWithKey(this.props.parts, partId);
        if (part) {
            if (this.state.part && this.state.part.changed) {
                if (window.confirm("You have made changes to the part, do you want to change the part and lose those changes?")) this.updateStateWithSelectionChanges('part', part);
            } else {
                this.updateStateWithSelectionChanges('part', part)
            }
        }
    };
    savePart = () => {
        this.props.savePart(this.state.part);
        this.updateStateWithSelectionChanges('persistedPart', this.state.part);
    };
    resetPart = () => {
        this.updateStateWithSelectionChanges('part', this.state.persistedPart);
    };
    deletePart = () => {
        const part = this.state.part;
        if (part.id) this.props.deletePart(part.id);
        this.setState(updateObject(this.state, { part: {}, persistedPart: {} }));
    };
    checkAndContinue = (nextAction) => {
        if (this.state.part && this.state.part.changed) {
            if (window.confirm("You have made changes to the part. If you want to keep them cancel and save the changes then continue.")) nextAction(this.state.part);
        } else {
            nextAction(this.state.part);
        }
    };

    render() {
        const { partTypeSelected, brandSelected, searchPartName, searchStandard, searchStocked, part, persistedPart } = this.state;
        const { closeAction, sections, brands, parts, partActionPrimary, partActionPrimaryIcon, partActionPrimaryTitle, partActionSecondary, partActionSecondaryIcon, partActionSecondaryTitle } = this.props;

        let partsForSelect = part ? parts.filter(part => part.partType === partTypeSelected) : [];
        if (brandSelected) partsForSelect = partsForSelect.filter(part => part.brand === brandSelected);
        if (searchStandard) partsForSelect = partsForSelect.filter(part => part.standard);
        if (searchStocked) partsForSelect = partsForSelect.filter(part => part.stocked);
        return <div className="grid-container">
            <h2>Find Part</h2>
            {closeAction && <div style={{ width: "100%", textAlign: "right" }}>
                <Icon
                    name="remove"
                    circular
                    link
                    onClick={() => this.checkAndContinue(closeAction)}
                />
            </div>}
            <div key="partFinderFields" className={`grid`}>
                <PartSearch
                    brands={brands}
                    sections={sections}
                    onChange={this.updateStateWithSelectionChanges}
                    findParts={this.findParts}
                    partTypeSelected={partTypeSelected}
                    brandSelected={brandSelected}
                    searchPartName={searchPartName}
                    searchStandard={searchStandard}
                    searchStocked={searchStocked}
                />
                <div
                    className="grid-row"
                    key={`findPartTypeRow`}
                >
                    <div
                        className="grid-item--borderless field-label align_right"
                    >
                        Part Type:
                    </div>
                    <div
                        className="grid-item--borderless field-label "
                    >
                        <PartTypeSelect
                            sections={sections}
                            partTypeSelected={partTypeSelected}
                            fieldName={'partTypeSelected'}
                            onChange={this.updateStateWithSelectionChanges}
                            isEmptyAllowed={true}
                        />
                    </div>
                </div>
                <div
                    className="grid-row"
                    key={`findBrandRow`}
                >
                    <div
                        className="grid-item--borderless field-label align_right"
                    >
                        Brand:
                    </div>
                    <div
                        className="grid-item--borderless field-label "
                    >
                        <BrandSelect
                            brands={brands}
                            brandSelected={brandSelected}
                            fieldName={'brandSelected'}
                            onChange={this.updateStateWithSelectionChanges}
                            isEmptyAllowed={true}
                        />
                    </div>
                </div>
                <div
                    className="grid-row"
                    key={`partialPartNameRow`}
                >
                    <div
                        className="grid-item--borderless field-label align_right"
                    >
                        Part name contains:
                    </div>
                    <div
                        className="grid-item--borderless field-label "
                    >
                        <FormTextInput
                            placeholder="part name"
                            id="searchPartName"
                            fieldName="searchPartName"
                            onChange={this.updateStateWithSelectionChanges}
                            onClick={this.updateStateWithSelectionChanges}
                            value={searchPartName}/>
                    </div>
                </div>
                <div
                    className="grid-row"
                    key={`selectStandard`}
                >
                    <div
                        className="grid-item--borderless field-label align_right"
                    >
                        Standard only
                    </div>
                    <div
                        className="grid-item--borderless field-label "
                    >
                        <input
                            type="checkbox"
                            name="searchStandard"
                            onChange={() => this.updateStateWithSelectionChanges("searchStandard", !searchStandard)}
                            checked={searchStandard}
                        />
                    </div>
                </div>
                <div
                    className="grid-row"
                    key={`selectStocked`}
                >
                    <div
                        className="grid-item--borderless field-label align_right"
                    >
                        Stocked only
                    </div>
                    <div
                        className="grid-item--borderless field-label "
                    >
                        <input
                            type="checkbox"
                            name="searchStocked"
                            onChange={() => this.updateStateWithSelectionChanges("searchStocked", !searchStocked)}
                            checked={searchStocked}
                        />
                    </div>
                </div>
                <div
                    className="grid-row"
                    key={`runSearchRow`}
                >
                    <div
                        className="grid-item--borderless field-label align_right"
                    >
                        Run Search
                    </div>
                    <div
                        className="grid-item--borderless field-label "
                    >
                        <Icon
                            name={'search'}
                            onClick={() => this.findParts()}
                            title={`find parts matching selection`}
                        />
                    </div>
                </div>
                {(partsForSelect.length > 0) && <div
                    className="grid-row"
                    key={`runSearchRow`}
                >
                    <div
                        className="grid-item--borderless field-label align_right"
                        key={`selectStandard`}
                    >
                        Choose Part:
                    </div>
                    <div
                        className="grid-item--borderless field-label "
                    >
                        <PartSelect
                            fieldName="partId"
                            brands={brands}
                            parts={partsForSelect}
                            onChange={this.changePartViewed}
                            partSelected={part}
                        />
                    </div>
                </div>}
            </div>
            <EditModelPage
                modelFields={getModelFields(part, (!(part && part.id)))}
                model={part}
                persistedModel={persistedPart}
                sections={sections}
                brands={brands}
                onChange={this.updatePartFieldsInState}
            />
            {part && <div style={{ width: "100%", textAlign: "right" }}>
                {part.changed &&
                <Icon id={`reset-part`} name="undo"
                      onClick={this.resetPart}
                      title="Reset Part details"
                />
                }
                {partReadyToUse(part) &&
                <Icon
                    key="primaryAction"
                    name={partActionPrimaryIcon}
                    onClick={() => partActionPrimary(part)}
                    title={partActionPrimaryTitle}
                />
                }
                {partActionSecondary &&
                <Icon
                    key="secondaryAction"
                    name={partActionSecondaryIcon}
                    onClick={() => partActionSecondary(part)}
                    title={partActionSecondaryTitle}
                />
                }
            </div>}
        </div>
    }
}

PartFinder.defaultProps = {
    parts: [],
};
PartFinder.propTypes = {
    sections: PropTypes.array.isRequired,
    brands: PropTypes.array.isRequired,
    parts: PropTypes.array,
    partType: PropTypes.number,
    part: PropTypes.object,
    findParts: PropTypes.func.isRequired,
    closeAction: PropTypes.func.isRequired,
    partActionPrimary: PropTypes.func.isRequired,
    partActionPrimaryIcon: PropTypes.string.isRequired,
    partActionPrimaryTitle: PropTypes.string.isRequired,
    partActionSecondary: PropTypes.func,
    partActionSecondaryIcon: PropTypes.string,
    partActionSecondaryTitle: PropTypes.string,
};

export default PartFinder;