import React from "react";
import * as PropTypes from "prop-types";
import {updateObject} from "../../helpers/utils";
import {updateModel} from "../app/model/helpers/model";
import EditModelPage from "../app/model/EditModelPage";
import ModelEditIcons from "../app/model/ModelEditIcons";
import {buildPartString} from "../part/helpers/part";
import {buildModelFields} from "./helpers/quotePart";

class QuotePartEdit extends React.Component {
    state = {};

    componentWillMount() {
        this.setState(this.deriveStateFromProps());
    };

    componentDidUpdate(prevProps) {
        if (this.props.quote !== prevProps.quote) this.deriveStateFromProps();
    }

    deriveStateFromProps = () => {
        let persistedQuotePart;
        let part_desc;

        if (this.props.replacementPart)
            part_desc = buildPartString(this.props.replacementPart, this.props.parts);

        const fields = buildModelFields(this.props.partType, this.props.quotePart, this.props.bikePart );
        if (this.props.quotePart)
            persistedQuotePart = updateObject(this.props.quotePart, {part_desc});

        return { fields, persistedQuotePart, quotePart: updateObject(persistedQuotePart) };
    };

    handleInputChange = (fieldName, input) => {
        const quotePart = updateModel(this.state.quotePart, this.state.fields, fieldName, input);
        // TODO add validation for whole model
        this.setState({ quotePart });
    };

    onClickReset = () => {
        this.setState(this.deriveStateFromProps());
    };

    render() {
        const { fields, quotePart, persistedQuotePart } = this.state;
        const { componentKey, sections } = this.props;
        return <div>
            <EditModelPage
                model={quotePart}
                className={'row'}
                persistedModel={persistedQuotePart}
                modelFields={fields}
                onChange={this.handleInputChange}
                showReadOnlyFields={true}
                sections={sections}
            />
            <div className="align_right">
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

QuotePartEdit.defaultProps = {
};
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
     brands: PropTypes.array.isRequired,
     sections: PropTypes.array.isRequired,
};
export default QuotePartEdit;

