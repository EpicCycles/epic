import React from 'react';
import ShowOrHide from "../ShowOrHide";

test("it renders without failing", () => {
    const hideDetail =  jest.fn();
    const showDetail =  jest.fn();
    const component = shallow(<ShowOrHide
        componentKey="mykey"
        isShown={false}
        hideDetail={hideDetail}
        showDetail={showDetail}
    />);
    expect(component).toMatchSnapshot();
});
test("it calls hide when details shown and icon clicked", () => {
    const hideDetail =  jest.fn();
    const showDetail =  jest.fn();
    const component = shallow(<ShowOrHide
        componentKey="mykey"
        isShown={false}
        hideDetail={hideDetail}
        showDetail={showDetail}
    />);

    expect(component.find('#mykey').length).toBe(1);
    component.find('#mykey').simulate("click");
    expect(showDetail).toBeCalled();
});