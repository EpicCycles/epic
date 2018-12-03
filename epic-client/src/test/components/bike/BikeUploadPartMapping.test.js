import React from 'react';
import {BikeUploadPartMapping} from "../../../components/bike/BikeUploadPartMapping";

// partType allowDrop assignToPartType rowMappings section section.index
test("it renders correctly for first row in section no mapped details", () => {
    const partType= {shortName:"my Part Type"};
    const rowMappings = [];
    const section = {name:"section 1"};
    const component = shallow(<BikeUploadPartMapping
        partType={partType}
        section={section}
        sectionIndex={0}
        rowMappings={rowMappings}
    />);
    expect(component).toMatchSnapshot();

});
test("it renders correctly for row in section with mapped details", () => {
    const partType= {shortName:"my Part Type"};
    const rowMappings = [{fieldName:"blah"}];
    const section = {name:"section 1"};
    const component = shallow(<BikeUploadPartMapping
        partType={partType}
        section={section}
        sectionIndex={1}
        rowMappings={rowMappings}
    />);
    expect(component).toMatchSnapshot();
});
