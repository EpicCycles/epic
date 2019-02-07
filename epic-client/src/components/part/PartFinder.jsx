import React from 'react'
import * as PropTypes from "prop-types";

import PartTypeSelect from "../partType/PartTypeSelect";
import {findObjectWithKey, updateObject, updateObjectWithSelectionChanges} from "../../helpers/utils";
import BrandSelect from "../brand/BrandSelect";
import FormTextInput from "../../common/FormTextInput";
import Icon from "semantic-ui-react/dist/commonjs/elements/Icon/Icon";
import PartSelect from "./PartSelect";
import {partFields} from "../app/model/helpers/fields";
import {getComponentKey, updateModelWithChanges} from "../app/model/helpers/model";
import PartEditBlock from "./PartEditBlock";

// TODO selected part shows values in part fields.
// TODO changes saved option
// TODO - actions and button labels for next - so for bike will just be use part, for quote could be replace existing part, add to quote
// TODO - can instantiate with existing part - so part type and brand will be populated - part selection will be all parts with matching values - seelected part will be current value and those attributes will display.
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
        const part = updateModelWithChanges(this.state.part, partFields, fieldName, value);
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
            if (window.confirm("You have made changes to the part. If you want to keep then cancel and save the changes then continue?")) nextAction(this.state.part);
        } else {
            nextAction(this.state.part);
        }
    }

    render() {
        const { partTypeSelected, brandSelected, searchPartName, searchStandard, searchStocked, part, persistedPart } = this.state;
        const { sections, brands, parts, partActionPrimary, partActionPrimaryIcon, partActionPrimaryTitle, partActionSecondary, partActionSecondaryIcon, partActionSecondaryTitle } = this.props;

        let partsForSelect = partType ? parts.filter(part => part.partType === partTypeSelected) : []
        if (brandSelected) partsForSelect = partsForSelect.filter(part => part.brand === brandSelected);
        return <div className="grid-container">
            <h2>Find Part</h2>
            <div key="partFinderFields" className={`grid`}>
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
                    key={`partialPartNameRow`}
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
                            key={'runSearchIcon'}
                            onClick={() => this.findParts()}
                            title={`Go to first ${pagingThingLower}`}/>
                        />
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
                        key={`selectStandard`}
                    >
                        Run Search
                    </div>
                    <div
                        key={`fieldDiv${index}`}
                        className="grid-item--borderless field-label "
                    >
                        <Icon
                            name={'search'}
                            onClick={() => props.findParts(1)}
                            title={`Go to first ${pagingThingLower}`}/>
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
                        key={`fieldDiv${index}`}
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
            <PartEditBlock
                componentKey={getComponentKey(part)}
                part={part}
                persistedPart={persistedPart}
                partTypeEditable={!part.id}
                sections={sections}
                brands={brands}
                onChange={this.updatePartFieldsInState()}
                savePart={this.savePart}
                resetPart={this.resetPart}
                deletePart={this.deletePart}
            />
            {part && <div style={{ width: "100%", textAlign: "right" }}>
                <Icon
                    key="primaryAction"
                    name={partActionPrimaryIcon}
                      onClick={this.checkAndContinue(partActionPrimary)}
                      title={partActionPrimaryTitle}
                />
                {partActionSecondary &&
                <Icon
                    key="secondaryAction"
                      name={partActionSecondaryIcon}
                      onClick={this.checkAndContinue(partActionSecondary)}
                      title={partActionSecondaryTitle}
                />
                }
            </div>}
        </div>
    }

}

PartFinder.propTypes = {
    sections: PropTypes.Array.isRequired,
    parts: PropTypes.Array,
    partType: PropTypes.number,
    part: PropTypes.object,
    savePart: PropTypes.func.isRequired,
    deletePart: PropTypes.func.isRequired,
    findParts: PropTypes.func.isRequired,
    partActionPrimary: PropTypes.func.isRequired,
    partActionPrimaryIcon: PropTypes.string.isRequired,
    partActionPrimaryTitle: PropTypes.string.isRequired,
    partActionSecondary: PropTypes.func,
    partActionSecondaryIcon: PropTypes.string,
    partActionSecondaryTitle: PropTypes.string,
};

export default PartFinder;