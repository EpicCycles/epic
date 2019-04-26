import React from "react";
import * as PropTypes from "prop-types";
import {updateObject} from "../../helpers/utils";
import {checkForChangesAllFields, updateModel} from "../app/model/helpers/model";
import ModelEditIcons from "../app/model/ModelEditIcons";
import {addDescToQuotePart, buildModelFields, modelFields} from "./helpers/quotePart";
import EditModelRow from "../app/model/EditModelRow";
import {getPartType} from "../partType/helpers/partType";
import {quotePartValidation} from "./helpers/validation";
import {calculatePrice} from "../part/helpers/price";

class QuotePartEdit extends React.Component {

    static getDerivedStateFromProps(props, state) {
        // Any time the current user changes,
        // Reset any parts of state that are tied to that user.
        // In this simple example, that's just the email.
        if (checkForChangesAllFields(modelFields, props.quotePart, state.persistedQuotePart)) {
            return {
                quotePart: addDescToQuotePart(props),
                persistedQuotePart: addDescToQuotePart(props),
            };
        }
        return null;
    }



    state = {
        quotePart: addDescToQuotePart(this.props),
        persistedQuotePart: addDescToQuotePart(this.props),
    };

    handleInputChange = (fieldName, input) => {
        let { quotePart } = this.state;

        let { partType, bikePart, brands, parts, sections, quote, supplierProducts } = this.props;
        const fields = buildModelFields(partType, quotePart, bikePart, quote);
        let updatedQuotePart = updateModel(quotePart, fields, fieldName, input);
        if (updatedQuotePart.partType) partType = getPartType(updatedQuotePart.partType, sections);
        updatedQuotePart = quotePartValidation(
            updatedQuotePart,
            bikePart,
            partType,
            brands,
            parts,
            quote
        );
        if (updatedQuotePart.part_desc !== quotePart.part_desc ||
            updatedQuotePart.not_required !== quotePart.not_required) {
            updatedQuotePart = updateObject(updatedQuotePart,
                calculatePrice(
                    (!!quote.bike),
                    updatedQuotePart.not_required,
                    updatedQuotePart.part,
                    bikePart,
                    supplierProducts
                ));
        }
        this.setState({ quotePart: updatedQuotePart });
    };

    onClickReset = () => {
        const quotePart = updateObject(this.state.persistedQuotePart);
        this.setState({ quotePart });
    };

    saveQuotePart = () => {
        let quotePart = updateObject(this.state.quotePart);
        const part = quotePart.part;

        if (part && !part.id) {
            this.props.saveQuotePart(quotePart, part);
        } else {
            if (part) quotePart.part = part.id;
            this.props.saveQuotePart(quotePart);
        }
    };
    deleteQuotePart = (deletionKey) => {
        this.props.deleteQuotePart(deletionKey, this.state.quotePart.quote);
    };
    render() {
        const { quotePart, persistedQuotePart } = this.state;

        const { componentKey, sections, suppliers, partType, quote, bikePart } = this.props;
        const fields = buildModelFields(partType, quotePart, bikePart, quote);
        const rowClass = (quotePart && quotePart.error) ? "error" : "";

        return <div className={`grid-row ${rowClass}`} key={`row${componentKey}`}>
            <EditModelRow
                model={quotePart}
                persistedModel={persistedQuotePart}
                modelFields={fields}
                onChange={this.handleInputChange}
                sections={sections}
                suppliers={suppliers}
            />
            <div className="grid-col--fixed-right align_center">
                <ModelEditIcons
                    componentKey={componentKey}
                    model={quotePart}
                    modelSave={this.saveQuotePart}
                    modelDelete={this.deleteQuotePart}
                    modelReset={this.onClickReset}
                />
            </div>
        </div>;
    }
}

QuotePartEdit.defaultProps = {};
QuotePartEdit.propTypes = {
    quotePart: PropTypes.object,
    bikePart: PropTypes.object,
    replacementPart: PropTypes.object,
    partType: PropTypes.object,
    deleteQuotePart: PropTypes.func.isRequired,
    saveQuotePart: PropTypes.func.isRequired,
    componentKey: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    quote: PropTypes.object.isRequired,
    brands: PropTypes.array.isRequired,
    suppliers: PropTypes.array.isRequired,
    sections: PropTypes.array.isRequired,
    parts: PropTypes.array.isRequired,
    supplierProducts: PropTypes.array.isRequired,
};
export default QuotePartEdit;

