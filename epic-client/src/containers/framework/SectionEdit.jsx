import React, {Fragment} from "react";
import FormTextInput from "../../common/FormTextInput";
import {generateRandomCode} from "../../helpers/utils";
import PartTypes from "./PartTypes";
import {NEW_FRAMEWORK_ID} from "../../helpers/framework";

class SectionEdit extends React.Component {
    handleInputChange = (fieldName, input) => {
        const updatedSection = Object.assign({}, this.props.section);
        if (fieldName.startsWith('name')) {
            if (updatedSection.name) {
                updatedSection.name = input;
            } else {
                updatedSection.name = "";
            }
        }
        if (fieldName.startsWith('partTypes')) updatedSection.partTypes = input;

        if (updatedSection.id || updatedSection.dummyKey || updatedSection.name) {
            if (!(updatedSection.id || updatedSection.dummyKey)) updatedSection.dummyKey = generateRandomCode();
            this.props.handleSectionChange(this.props.componentKey, updatedSection);
        }
    };

    handleInputClear = (fieldName) => {
        const updatedSection = Object.assign({}, this.props.section);
        updatedSection.delete = true;
        this.props.handleSectionChange(this.props.componentKey, updatedSection);
    };

    render() {
        const { section, componentKey } = this.props;
        const partTypes = section.partTypes || [];
        return <Fragment>
            <td>
                <FormTextInput
                    placeholder="add new"
                    fieldName={`name_${componentKey}`}
                    value={section.name}
                    onChange={this.handleInputChange}
                    onClick={this.handleInputClear}
                />
            </td>
            <td>
                {componentKey !== NEW_FRAMEWORK_ID &&
                <PartTypes
                    sectionKey={componentKey}
                    partTypes={partTypes}
                    handleSectionChange={this.handleInputChange}
                />
                }
            </td>
        </Fragment>;
    }
}

export default SectionEdit;