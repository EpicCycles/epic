import React from "react";
import {CURRENCY} from "../../helpers/models";
import EditModelField from "../../common/EditModelField";
import {NEW_ELEMENT_ID} from "../../helpers/constants";

const field =  {
    fieldName: "data_field",
    type: CURRENCY,
    length:10
};
const model= {data_field: 23.90};

test("it renders a field", () => {
   const component = shallow(<EditModelField
       index={0}
       field={field}
       model={model}
       componentKey={NEW_ELEMENT_ID}
       onChange={jest.fn()}
   />);
    expect(component).toMatchSnapshot();
});
