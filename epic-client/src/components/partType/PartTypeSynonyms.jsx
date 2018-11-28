import React from "react";
import FormTextInput from "../../common/FormTextInput";
import {findIndexOfObjectWithKey, generateRandomCode} from "../../helpers/utils";
import {Icon} from "semantic-ui-react";
import {NEW_ELEMENT_ID} from "../../helpers/constants";

class PartTypeSynonyms extends React.Component {
    handleInputChange = (fieldName, input) => {
        const fields = fieldName.split('_');
        const synonymKey = fields[1];
        const synonymsWithUpdates = this.props.synonyms.slice();
        const synonymToUpdateIndex = findIndexOfObjectWithKey(synonymsWithUpdates, synonymKey);

        if (synonymToUpdateIndex > -1) {
            if (input) {
                synonymsWithUpdates[synonymToUpdateIndex].shortName = input;
                synonymsWithUpdates[synonymToUpdateIndex].error = false;
                synonymsWithUpdates[synonymToUpdateIndex].error_detail = "";
            } else {
                synonymsWithUpdates[synonymToUpdateIndex].error = true;
                synonymsWithUpdates[synonymToUpdateIndex].error_detail = "A value is required for the synonym";
            }
            synonymsWithUpdates[synonymToUpdateIndex].changed = true;
        } else if (input) {
            synonymsWithUpdates.push({
                "dummyKey": NEW_ELEMENT_ID,
                "shortName": input
            });
        }

        this.props.handlePartTypeChange(`synonyms_${this.props.partTypeKey}`, synonymsWithUpdates);
    };
    addAnother = () => {
        const synonymsWithUpdates = this.props.synonyms.slice();
        const synonymToUpdateIndex = findIndexOfObjectWithKey(synonymsWithUpdates, NEW_ELEMENT_ID);
        synonymsWithUpdates[synonymToUpdateIndex].dummyKey = generateRandomCode();
        this.props.handlePartTypeChange(`synonyms_${this.props.partTypeKey}`, synonymsWithUpdates);
    };

    handleInputClear = (fieldName) => {
        const fields = fieldName.split('_');
        const synonymKey = fields[1];
        const synonymsWithUpdates = this.props.synonyms.slice();
        if (synonymKey !== "new") {
            const synonymToUpdateIndex = findIndexOfObjectWithKey(synonymsWithUpdates, synonymKey);
            if (synonymToUpdateIndex > -1) {
                if (window.confirm("Please confirm that you want to delete this Attribute")) {
                    synonymsWithUpdates[synonymToUpdateIndex].delete = true;
                    this.props.handlePartTypeChange(`synonyms_${this.props.partTypeKey}`, synonymsWithUpdates);
                }
            }
        }
    };

    render() {
        const { partTypeKey, synonyms } = this.props;
        const synonymsToUse = synonyms ? synonyms.filter(synonym => !(synonym.delete || (synonym.dummyKey === NEW_ELEMENT_ID))) : [];
        const newSynonym = synonyms ? synonyms.filter(synonym => (synonym.dummyKey === NEW_ELEMENT_ID)) : [];
        let newSynonymDisplay = (newSynonym.length > 0) ? newSynonym[0] : {};
        return <table>
            <tbody>
            {synonymsToUse.map((synonym) => {
                const componentKey = synonym.id ? synonym.id : synonym.dummyKey;
                const className = synonym.error ? "error" : "";
                const rowTitle = synonym.error ? synonym.error_detail : "";
                return <tr
                    key={`synonym_${componentKey}`}
                    className={className}
                    title={rowTitle}
                >
                    <td><FormTextInput
                        placeholder="add new"
                        fieldName={`synonymValue_${componentKey}`}
                        value={synonym.shortName}
                        onChange={this.handleInputChange}
                        onClick={this.handleInputClear}
                    /></td>
                </tr>
            })}

            <tr key={`newSynonym${partTypeKey}`}>
                <td><FormTextInput
                    placeholder="add new"
                    fieldName="synonymValue_new"
                    value={newSynonymDisplay.shortName ? newSynonymDisplay.shortName : ""}
                    onChange={this.handleInputChange}
                    onClick={this.handleInputClear}
                /></td>
                <td>
                    <Icon
                        name="add"
                        onClick={this.addAnother}
                        title="confirm new Synonym"
                    />
                </td>
            </tr>
            </tbody>
        </table>;
    }
}

export default PartTypeSynonyms;