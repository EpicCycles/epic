import React from 'react';
import {BikeUploadMatchedData} from "../../../components/bike/BikeUploadMatchedData";

test("it renders correctly", () => {
    const matched = { rowIndex: 12, rowField: "Chain" };
    const component = shallow(<BikeUploadMatchedData
        matched={matched}
        matchIndex={0}
    />);
    expect(component).toMatchSnapshot();
});
test("it renders correctly when not first match", () => {
    const matched = { rowIndex: 12, rowField: "Chain" };
    const component = shallow(<BikeUploadMatchedData
        matched={matched}
        matchIndex={3}
    />);
    expect(component).toMatchSnapshot();
});