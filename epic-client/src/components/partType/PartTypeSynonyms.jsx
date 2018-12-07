import React, {Fragment} from "react";
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
            synonymsWithUpdates[synonymToUpdateIndex].shortName = input;
            if (input) {
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
        const { synonyms, label } = this.props;
        const synonymsToUse = synonyms ? synonyms.filter(synonym => !(synonym.delete || (synonym.dummyKey === NEW_ELEMENT_ID))) : [];
        const newSynonym = synonyms ? synonyms.filter(synonym => (synonym.dummyKey === NEW_ELEMENT_ID)) : [];
        let newSynonymDisplay = (newSynonym.length > 0) ? newSynonym[0] : {};
        return <Fragment>
            {label && <div className="field-label">{label}</div>}
            {synonymsToUse.map((synonym) => {
                const componentKey = synonym.id ? synonym.id : synonym.dummyKey;
                const synonymError = synonym.error ? synonym.error_detail : "";
                return <FormTextInput
                    placeholder="add new"
                    key={`synonymValue_${componentKey}`}
                    fieldName={`synonymValue_${componentKey}`}
                    value={synonym.shortName}
                    onChange={this.handleInputChange}
                    onClick={this.handleInputClear}
                    error={synonymError}
                />
            })}
            <div><FormTextInput
                placeholder="add new"
                key="synonymValue_new"
                fieldName="synonymValue_new"
                value={newSynonymDisplay.shortName ? newSynonymDisplay.shortName : ""}
                onChange={this.handleInputChange}
                onClick={this.handleInputClear}
            />
                <Icon
                    key="synonym_add"
                    name="add"
                    onClick={this.addAnother}
                    title="confirm new Synonym"
                /></div>
        </Fragment>;
    }
}

export default PartTypeSynonyms;