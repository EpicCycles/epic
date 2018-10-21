import React from "react";
import FormTextInput from "../../common/FormTextInput";
import {findIndexOfObjectWithKey, generateRandomCode} from "../../helpers/utils";
import {
    moveObjectDownOnePlace,
    moveObjectToBottom,
    moveObjectToTop,
    moveObjectUpOnePlace
} from "../../helpers/framework";
import FrameworkMoves from "./FrameworkMoves";


class AttributeOptions extends React.Component {
    handleInputChange = (fieldName, input) => {
        const fields = fieldName.split('_');
        const optionKey = fields[1];
        const optionsWithUpdates = this.props.options.slice();
        if (optionKey === "new") {
            if (input) {
                optionsWithUpdates.push({
                    "dummyKey": generateRandomCode(),
                    "attribute_option": input
                });
            }
        } else {
            const optionToUpdateIndex = findIndexOfObjectWithKey(optionsWithUpdates, optionKey);
            if (optionToUpdateIndex > -1) {
                if (input) {
                    optionsWithUpdates[optionToUpdateIndex].attribute_option = input;
                } else {
                    optionsWithUpdates[optionToUpdateIndex].delete = true;
                }
            } else if (input) {
                optionsWithUpdates.push({
                    "dummyKey": generateRandomCode(),
                    "attribute_option": input
                });
            }
        }

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
                optionsWithUpdates[optionToUpdateIndex].delete = true;
                this.props.handleAttributeChange(`options_${this.props.attributeKey}`, optionsWithUpdates);
            }
        }
    };

    render() {
        const { attributeKey, options } = this.props;
        const optionsToUse = options.filter(option => !option.delete);
        return <table>
            <tbody>
            <tr>
                <th>Value</th>
                <th>Position</th>
            </tr>
            {optionsToUse.map((option) => {
                const fieldkey = option.id ? option.id : option.dummyKey;
                return <tr key={`option_${fieldkey}`}>
                    <td><FormTextInput
                        placeholder="add new"
                        fieldName={`optionValue_${fieldkey}`}
                        value={option.attribute_option}
                        onChange={this.handleInputChange}
                        onClick={this.handleInputClear}
                    /></td>
                    {optionsToUse.length > 1 &&
                    <td><FrameworkMoves
                        fieldkey={fieldkey}
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
                    value=""
                    onChange={this.handleInputChange}
                    onClick={this.handleInputClear}
                /></td>
                <td></td>
            </tr>
            </tbody>
        </table>;
    }
}

export default AttributeOptions;