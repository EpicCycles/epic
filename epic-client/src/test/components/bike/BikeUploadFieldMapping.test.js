import React from 'react';
import {COLOURS_FIELD} from "../../../helpers/models";
import {BikeUploadFieldMapping} from "../../../components/bike/BikeUploadFieldMapping";
let undoMapping = jest.fn();

test("it renders correctly when no rows match", () => {
    const field = COLOURS_FIELD;
    const rowMappings = [];
    const component = shallow(<BikeUploadFieldMapping
        field={field}
        index={0}
        rowMappings={rowMappings}
        undoMapping={undoMapping}
    />);
    expect(component).toMatchSnapshot();
});
test("it renders correctly when rows match", () => {
    const field = COLOURS_FIELD;
    const rowMappings = [{fieldName:"blah"}];
    const component = shallow(<BikeUploadFieldMapping
        field={field}
        index={1}
        rowMappings={rowMappings}
        undoMapping={undoMapping}
    />);
    expect(component).toMatchSnapshot();
});