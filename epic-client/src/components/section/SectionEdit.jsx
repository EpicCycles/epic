import React, {Fragment} from "react";
import FormTextInput from "../../common/FormTextInput";
import {generateRandomCode} from "../../helpers/utils";
import PartTypes from "../partType/PartTypes";
import {Icon} from "semantic-ui-react";
import {NEW_ELEMENT_ID} from "../../helpers/constants";

class SectionEdit extends React.Component {
    handleInputChange = (fieldName, input) => {
        const updatedSection = Object.assign({}, this.props.section);
        if (fieldName.startsWith('name')) updatedSection.name = input;
        if (fieldName.startsWith('partTypes')) updatedSection.partTypes = input;
        if (fieldName.startsWith('detail')) updatedSection._detail = input;
        if (!updatedSection.name) {
            updatedSection.error = true;
            updatedSection.error_detail = "A name is required for the section";
        } else {
            updatedSection.error = false;
            updatedSection.error_detail = "";
        }

        let componentKey = this.props.componentKey;
        if (componentKey === NEW_ELEMENT_ID) {
            updatedSection.dummyKey = NEW_ELEMENT_ID;
        }
        updatedSection.changed = true;
        this.props.handleSectionChange(componentKey, updatedSection);
    };

    handleInputClear = (fieldName) => {
        if (window.confirm("Please confirm that you want to delete this section and all associated part types and their attributes.")) {
            const updatedSection = Object.assign({}, this.props.section);
            updatedSection.delete = true;
            this.props.handleSectionChange(this.props.componentKey, updatedSection);
        }
    };

    toggleDetail = () => {
        this.handleInputChange("detail", !this.props.section._detail);
    };
    addAnother = () => {
        const updatedSection = Object.assign({}, this.props.section);
        updatedSection.dummyKey = generateRandomCode();
        this.props.handleSectionChange(NEW_ELEMENT_ID, updatedSection);
    };

    render() {
        const { section, componentKey } = this.props;
        const partTypes = section.partTypes || [];
        return <Fragment>
            <div  className="grid-item grid-item--fixed-left">
                {componentKey !== NEW_ELEMENT_ID ?
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
            </div>
            <div className="grid-item">
                <FormTextInput
                    placeholder="add new"
                    fieldName={`name_${componentKey}`}
                    value={section.name}
                    onChange={this.handleInputChange}
                    onClick={this.handleInputClear}
                />
                {(section._detail && componentKey !== NEW_ELEMENT_ID) &&
                <PartTypes
                    sectionKey={componentKey}
                    partTypes={partTypes}
                    handleSectionChange={this.handleInputChange}
                />
                }
            </div>
        </Fragment>;
    }
}

export default SectionEdit;