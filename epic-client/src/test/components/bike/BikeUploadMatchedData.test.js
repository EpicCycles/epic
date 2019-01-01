import React from 'react';
import {UploadMatchedData} from "../../../common/UploadMatchedData";

test("it renders correctly", () => {
    const matched = { rowIndex: 12, partTypeName: "Chain" };
    const component = shallow(<UploadMatchedData
        matched={matched}
        matchIndex={0}
    />);
    expect(component).toMatchSnapshot();
});
test("it renders correctly when not first match", () => {
    const matched = { rowIndex: 12, partTypeName: "Chain" };
    const component = shallow(<UploadMatchedData
        matched={matched}
        matchIndex={3}
    />);
    expect(component).toMatchSnapshot();
});