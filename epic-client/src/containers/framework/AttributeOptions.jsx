import React from "react";
import FormTextInput from "../../common/FormTextInput";
import {findIndexOfObjectWithKey, generateRandomCode} from "../../helpers/utils";
import {
    moveObjectDownOnePlace,
    moveObjectToBottom,
    moveObjectToTop,
    moveObjectUpOnePlace, NEW_FRAMEWORK_ID
} from "../../helpers/framework";
import FrameworkMoves from "./FrameworkMoves";
import Icon from "semantic-ui-react/dist/es/elements/Icon/Icon";


class AttributeOptions extends React.Component {
    handleInputChange = (fieldName, input) => {
        const fields = fieldName.split('_');
        const optionKey = fields[1];
        const optionsWithUpdates = this.props.options.slice();
        const optionToUpdateIndex = findIndexOfObjectWithKey(optionsWithUpdates, optionKey);

        if (optionToUpdateIndex > -1) {
            if (input) {
                optionsWithUpdates[optionToUpdateIndex].attribute_option = input;
            } else {
                optionsWithUpdates[optionToUpdateIndex].delete = true;
            }
        } else if (input) {
            optionsWithUpdates.push({
                "dummyKey": NEW_FRAMEWORK_ID,
                "attribute_option": input
            });
        }

        this.props.handleAttributeChange(`options_${this.props.attributeKey}`, optionsWithUpdates);
    };
    addAnother = () => {
        const optionsWithUpdates = this.props.options.slice();
        const optionToUpdateIndex = findIndexOfObjectWithKey(optionsWithUpdates, NEW_FRAMEWORK_ID);
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
                optionsWithUpdates[optionToUpdateIndex].delete = true;
                this.props.handleAttributeChange(`options_${this.props.attributeKey}`, optionsWithUpdates);
            }
        }
    };

    render() {
        const { attributeKey, options } = this.props;
        const optionsToUse = options ? options.filter(option => !(option.delete || (option.dummyKey === NEW_FRAMEWORK_ID))) : [];
        const newOptions = options ? options.filter(option => (option.dummyKey === NEW_FRAMEWORK_ID)) : [];
        let newOptionDisplay = (newOptions.length > 0) ? newOptions[0] : {};
        return <table>
            <tbody>
            {optionsToUse.map((option) => {
                const componentKey = option.id ? option.id : option.dummyKey;
                return <tr key={`option_${componentKey}`}>
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