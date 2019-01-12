import React from "react";
import FormTextInput from "../../common/FormTextInput";
import {findIndexOfObjectWithKey, generateRandomCode} from "../../helpers/utils";
import {
    moveObjectDownOnePlace,
    moveObjectToBottom,
    moveObjectToTop,
    moveObjectUpOnePlace
} from "../../helpers/framework";
import FrameworkMoves from "../framework/FrameworkMoves";
import {Icon} from "semantic-ui-react";
import {NEW_ELEMENT_ID} from "../../helpers/constants";
import {getComponentKey} from "../../helpers/models";

class AttributeOptions extends React.Component {
    handleInputChange = (fieldName, input) => {
        const fields = fieldName.split('_');
        const optionKey = fields[1];
        const optionsWithUpdates = this.props.options.slice();
        const optionToUpdateIndex = findIndexOfObjectWithKey(optionsWithUpdates, optionKey);

        if (optionToUpdateIndex > -1) {
            if (input) {
                optionsWithUpdates[optionToUpdateIndex].attribute_option = input;
                optionsWithUpdates[optionToUpdateIndex].error = false;
                optionsWithUpdates[optionToUpdateIndex].error_detail = "";
            } else {
                optionsWithUpdates[optionToUpdateIndex].error = true;
                optionsWithUpdates[optionToUpdateIndex].error_detail = "A value is required for the attribute";
            }
            optionsWithUpdates[optionToUpdateIndex].changed = true;
        } else if (input) {
            optionsWithUpdates.push({
                "dummyKey": NEW_ELEMENT_ID,
                "attribute_option": input
            });
        }

        this.props.handleAttributeChange(`options_${this.props.attributeKey}`, optionsWithUpdates);
    };
    addAnother = () => {
        const optionsWithUpdates = this.props.options.slice();
        const optionToUpdateIndex = findIndexOfObjectWithKey(optionsWithUpdates, NEW_ELEMENT_ID);
        optionsWithUpdates[optionToUpdateIndex].dummyKey = generateRandomCode();
        this.props.handleAttributeChange(`options_${this.props.attributeKey}`, optionsWithUpdates);
    };
    moveUp = (fieldName) => {
        const fields = fieldName.split('_');
        const optionKey = fields[1];
        this.props.handleAttributeChange(`options_${this.props.attributeKey}`, moveObjectUpOnePlace(this.props.options, optionKey));
    };
    moveDown = (fieldName) => {
        const fields = fieldName.split('_');
        const optionKey = fields[1];
        this.props.handleAttributeChange(`options_${this.props.attributeKey}`, moveObjectDownOnePlace(this.props.options, optionKey));
    };
    moveToTop = (fieldName) => {
        const fields = fieldName.split('_');
        const optionKey = fields[1];
        this.props.handleAttributeChange(`options_${this.props.attributeKey}`, moveObjectToTop(this.props.options, optionKey));
    };
    moveToBottom = (fieldName) => {
        const fields = fieldName.split('_');
        const optionKey = fields[1];
        this.props.handleAttributeChange(`options_${this.props.attributeKey}`, moveObjectToBottom(this.props.options, optionKey));
    };
    handleInputClear = (fieldName) => {
        const fields = fieldName.split('_');
        const optionKey = fields[1];
        const optionsWithUpdates = this.props.options.slice();
        if (optionKey !== "new") {
            const optionToUpdateIndex = findIndexOfObjectWithKey(optionsWithUpdates, optionKey);
            if (optionToUpdateIndex > -1) {
                if (window.confirm("Please confirm that you want to delete this Attribute")) {
                    optionsWithUpdates[optionToUpdateIndex].delete = true;
                    this.props.handleAttributeChange(`options_${this.props.attributeKey}`, optionsWithUpdates);
                }
            }
        }
    };

    render() {
        const { attributeKey, options } = this.props;
        const optionsToUse = options ? options.filter(option => !(option.delete || (option.dummyKey === NEW_ELEMENT_ID))) : [];
        const newOptions = options ? options.filter(option => (option.dummyKey === NEW_ELEMENT_ID)) : [];
        let newOptionDisplay = (newOptions.length > 0) ? newOptions[0] : {};
        return <table>
            <tbody>
            {optionsToUse.map((option) => {
                const componentKey = getComponentKey(option);
                const className = option.error ? "error" : "";
                const rowTitle = option.error ? option.error_detail : "";
                return <tr
                    key={`option_${componentKey}`}
                    className={className}
                    title={rowTitle}
                >
                    <td><FormTextInput
                        placeholder="add new"
                        fieldName={`optionValue_${componentKey}`}
                        value={option.attribute_option}
                        onChange={this.handleInputChange}
                        onClick={this.handleInputClear}
                    /></td>
                    {optionsToUse.length > 1 &&
                    <td><FrameworkMoves
                        componentKey={componentKey}
                        moveToTop={this.moveToTop}
                        moveUp={this.moveUp}
                        moveDown={this.moveDown}
                        moveToBottom={this.moveToBottom}
                    /></td>
                    }
                </tr>
            })}

            <tr key={`newOption${attributeKey}`}>
                <td><FormTextInput
                    placeholder="add new"
                    fieldName="optionValue_new"
                    value={newOptionDisplay.attribute_option ? newOptionDisplay.attribute_option : ""}
                    onChange={this.handleInputChange}
                    onClick={this.handleInputClear}
                /></td>
                <td>
                    <Icon
                        name="add"
                        onClick={this.addAnother}
                        title="confirm new Attribute"
                    />
                </td>
            </tr>
            </tbody>
        </table>;
    }
}

export default AttributeOptions;