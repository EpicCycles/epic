import React from 'react';
import QuoteEdit from "../QuoteEdit";
import {Icon} from "semantic-ui-react";

describe("QuoteEdit tests", () => {
    const quote = {
        id: 16,
        add_date: '2018-07-04T13:02:09.988286+01:00',
        upd_date: '2018-07-04T13:02:09.988343+01:00'
    };
    it('renders the form text correctly with quote', () => {
        const input = shallow(
            <QuoteEdit quote={quote} />
        );
        expect(input).toMatchSnapshot();
    });
    it('renders the form text correctly with no quote', () => {
        const input = shallow(
            <QuoteEdit />
        );
        expect(input).toMatchSnapshot();
    });
});