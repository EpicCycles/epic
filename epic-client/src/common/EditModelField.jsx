import React, {Component} from "react";
import EditModelInput from "./EditModelInput";

class EditModelField extends Component {


    render() {
        const { field, model, className, componentKey, index, onChange } = this.props;

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
                />
            </div>
        </div>;
    };
}

export default EditModelField;