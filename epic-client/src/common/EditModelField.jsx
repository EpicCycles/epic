import React, {Component} from "react";
import EditModelInput from "./EditModelInput";
import * as PropTypes from "prop-types";

class EditModelField extends Component {

    render() {
        const { field, model, className, componentKey, index, onChange,sections, brands, suppliers } = this.props;

        return <div className="grid-row">
            <div
                className="grid-item--borderless field-label align_right"
                key={`modelField${componentKey}${index}`}
            >
                {field.header}
            </div>
            <div
                key={`matchFieldDiv${componentKey}${index}`}
                className="grid-item--borderless field-label "
            >
                <EditModelInput
                    field={field}
                    model={model}
                    className={className}
                    componentKey={componentKey}
                    index={index}
                    onChange={onChange}
                    sections={sections}
                    brands={brands}
                    suppliers={suppliers}
                />
            </div>
        </div>;
    };
}
EditModelField.propTypes = {
    field: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    className: PropTypes.string,
    componentKey: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    sections: PropTypes.array,
    brands: PropTypes.array,
    suppliers: PropTypes.array,
};
export default EditModelField;