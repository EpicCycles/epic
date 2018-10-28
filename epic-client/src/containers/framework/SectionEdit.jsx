import React, {Fragment} from "react";
import FormTextInput from "../../common/FormTextInput";
import {generateRandomCode} from "../../helpers/utils";
import PartTypes from "./PartTypes";
import {NEW_FRAMEWORK_ID} from "../../helpers/framework";
import {Icon} from "semantic-ui-react";

class SectionEdit extends React.Component {
    handleInputChange = (fieldName, input) => {
        const updatedSection = Object.assign({}, this.props.section);
        if (fieldName.startsWith('name')) updatedSection.name = input;
        if (fieldName.startsWith('partTypes')) updatedSection.partTypes = input;
        if (fieldName.startsWith('detail')) updatedSection._detail = input;
        if (!updatedSection.name) updatedSection.delete = true;

        let componentKey = this.props.componentKey;
        if (componentKey === NEW_FRAMEWORK_ID) {
            updatedSection.dummyKey = NEW_FRAMEWORK_ID;
        }
        this.props.handleSectionChange(componentKey, updatedSection);
    };

    handleInputClear = (fieldName) => {
        const updatedSection = Object.assign({}, this.props.section);
        updatedSection.delete = true;
        this.props.handleSectionChange(this.props.componentKey, updatedSection);
    };

    toggleDetail = () => {
        this.handleInputChange("detail", !this.props.section._detail);
    };
    addAnother = () => {
        const updatedSection = Object.assign({}, this.props.section);
        updatedSection.dummyKey = generateRandomCode();
        this.props.handleSectionChange(NEW_FRAMEWORK_ID, updatedSection);
    };

    render() {
        const { section, componentKey } = this.props;
        const partTypes = section.partTypes || [];
        return <Fragment>
            <td>
                {componentKey !== NEW_FRAMEWORK_ID ?
                    <Icon
                        name={`toggle ${section._detail ? "down" : "right"}`}
                        onClick={this.toggleDetail}
                    />
                    :
                    <Icon
                        name="add"
                        onClick={this.addAnother}
                    />
                }
            </td>
            <td>
                <FormTextInput
                    placeholder="add new"
                    fieldName={`name_${componentKey}`}
                    value={section.name}
                    onChange={this.handleInputChange}
                    onClick={this.handleInputClear}
                />
                {(section._detail && componentKey !== NEW_FRAMEWORK_ID) &&
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