import React from 'react';
import {shallow} from "enzyme";
import ErrorDismissibleBlock from "../../common/ErrorDismissibleBlock";

describe("ErrorDismissibleBlock tests", () => {
    it('renders the errorDismissableBlock correctly', () => {
        const errorDismissibleBlock = shallow(
            <ErrorDismissibleBlock error={'Show me the error'} removeError={() => {
            }}/>
        );
        expect(errorDismissibleBlock).toMatchSnapshot();
    });

});
