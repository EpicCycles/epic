import React, {Fragment} from "react";
import * as PropTypes from "prop-types";
import PartTypeSelect from "../partType/PartTypeSelect";
import BrandSelect from "../brand/BrandSelect";
import FormTextInput from "../../common/FormTextInput";
import {Icon} from "semantic-ui-react";

const PartSearch = props => {
    const { brands, sections, onChange, partTypeSelected, brandSelected, searchPartName, searchStandard, searchStocked, findParts } = props;

    return <Fragment>
        <div
            className="grid-row"
            key={`findPartTypeRow`}
        >
            <div
                className="grid-item--borderless field-label align_right"
            >
                Part Type:
            </div>
            <div className="grid-item--borderless field-label ">
                <PartTypeSelect
                    sections={sections}
                    partTypeSelected={partTypeSelected}
                    fieldName={'partTypeSelected'}
                    onChange={onChange}
                    isEmptyAllowed={true}
                    data-test="part-type-select"
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
                    onChange={onChange}
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
                    onChange={onChange}
                    onClick={onChange}
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
                    onChange={() => onChange("searchStandard", !searchStandard)}
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
                    onChange={() => onChange("searchStocked", !searchStocked)}
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
                    onClick={findParts}
                    title={`find parts matching selection`}
                />
            </div>
        </div>
    </Fragment>;
};

PartSearch.propTypes = {
    brands: PropTypes.array.isRequired,
    sections: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    findParts: PropTypes.func.isRequired,
    partTypeSelected: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    brandSelected: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    searchPartName: PropTypes.string,
    searchStandard: PropTypes.bool,
    searchStocked: PropTypes.bool,
};
export default PartSearch;