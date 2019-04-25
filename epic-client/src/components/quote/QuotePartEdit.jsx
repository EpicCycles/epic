import React from "react";
import * as PropTypes from "prop-types";
import {updateObject} from "../../helpers/utils";
import {updateModel} from "../app/model/helpers/model";
import ModelEditIcons from "../app/model/ModelEditIcons";
import {buildPartString} from "../part/helpers/part";
import {buildModelFields} from "./helpers/quotePart";
import EditModelRow from "../app/model/EditModelRow";
import {getPartType} from "../partType/helpers/partType";
import {quotePartValidation} from "./helpers/validation";
import {calculatePrice} from "../part/helpers/price";

class QuotePartEdit extends React.Component {
    state = {};

    componentWillMount() {
        this.setState(this.deriveStateFromProps());
    };

    componentDidUpdate(prevProps) {
        if (this.props.quotePart !== prevProps.quotePart) this.deriveStateFromProps();
    }

    deriveStateFromProps = () => {
        let persistedQuotePart;
        let part_desc;

        if (this.props.replacementPart)
            part_desc = buildPartString(this.props.replacementPart, this.props.brands);

        const fields = buildModelFields(this.props.partType, this.props.quotePart, this.props.bikePart, this.props.quote);
        if (this.props.quotePart) {
            persistedQuotePart = updateObject(this.props.quotePart, { part_desc });
        } else {
            persistedQuotePart = {
                quote: this.props.quote.id,
            };
            if (this.props.partType) persistedQuotePart.partType = this.props.partType.id;
        }

        return { fields, persistedQuotePart, quotePart: updateObject(persistedQuotePart) };
    };

    handleInputChange = (fieldName, input) => {
        let { quotePart, fields } = this.state;
        let { partType, bikePart, brands, parts, sections, quote, supplierProducts } = this.props;
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
        console.log(partType, updatedQuotePart, bikePart, quote)
        fields = buildModelFields(partType, updatedQuotePart, bikePart, quote);
        this.setState({ quotePart: updatedQuotePart, fields });
    };

    onClickReset = () => {
        this.setState(this.deriveStateFromProps());
    };

    saveQuotePart = () => {
        let quotePart = updateObject(this.state.quotePart);
        const part = quotePart.part;

        if (part && ! part.id) {
            this.props.saveQuotePart(quotePart, part);
        } else {
            if (part) quotePart.part = part.id;
            this.props.saveQuotePart(quotePart);
        }
    };
    deleteQuotePart = (deletionKey) => {
        this.props.deleteQuotePart(deletionKey, this.state.quotePart.quote);
    }
    render() {
        const { fields, quotePart, persistedQuotePart } = this.state;
        const { componentKey, sections,  suppliers } = this.props;
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

