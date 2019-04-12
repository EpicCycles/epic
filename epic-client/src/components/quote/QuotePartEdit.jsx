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
            part_desc = buildPartString(this.props.replacementPart, this.props.parts);

        const fields = buildModelFields(this.props.partType, this.props.quotePart, this.props.bikePart);
        if (this.props.quotePart) {
            persistedQuotePart = updateObject(this.props.quotePart, { part_desc });
        } else {
            persistedQuotePart = {
                quote: this.props.quoteId,
            };
            if (this.props.partType) persistedQuotePart.partType = this.props.partType.id;
        }

        return { fields, persistedQuotePart, quotePart: updateObject(persistedQuotePart) };
    };

    handleInputChange = (fieldName, input) => {
        let { quotePart, fields } = this.state;
        let { partType, bikePart } = this.props.partType;
        let updatedQuotePart = updateModel(quotePart, fields, fieldName, input);
        if (!partType && updatedQuotePart.partType) partType = getPartType(quotePart.partType, this.props.sections);
        updatedQuotePart = quotePartValidation(
            updatedQuotePart,
            bikePart,
            partType,
            this.props.brands,
            this.props.parts
        );
        if (updatedQuotePart.part_desc !== quotePart.part_desc ||
            updatedQuotePart.not_required !== quotePart.not_required) {
            updatedQuotePart = updateObject(updatedQuotePart,
                calculatePrice(
                    (!!this.props.quote.bike),
                    updatedQuotePart.not_required,
                    updatedQuotePart.part,
                    bikePart,
                    this.props.supplierProducts
                ));
        }
        fields = buildModelFields(partType, updatedQuotePart, this.props.bikePart);
        this.setState({ quotePart: updatedQuotePart, fields });
    };

    onClickReset = () => {
        this.setState(this.deriveStateFromProps());
    };


    render() {
        const { fields, quotePart, persistedQuotePart } = this.state;
        const { componentKey, sections } = this.props;
        const rowClass = (quotePart && quotePart.error) ? "error" : "";

        return <div className='grid-row' key={`row${componentKey}`}>
            <EditModelRow
                model={quotePart}
                persistedModel={persistedQuotePart}
                modelFields={fields}
                onChange={this.handleInputChange}
                sections={sections}
            />
            <div className="grid-col--fixed-right align_center">
                <ModelEditIcons
                    componentKey={componentKey}
                    model={quotePart}
                    modelSave={this.props.saveQuotePart}
                    modelDelete={this.props.deleteQuotePart}
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
    sections: PropTypes.array.isRequired,
    parts: PropTypes.array.isRequired,
    supplierProducts: PropTypes.array.isRequired,
};
export default QuotePartEdit;

