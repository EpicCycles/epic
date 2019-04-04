import React from 'react';
import QuoteSummary from "../QuoteSummary";
import {findDataTest} from "../../../../test/assert";
import {sampleSections} from "../../../helpers/sampleData";

describe('QuoteSummary', () => {
    it('should render message only when no part type data', () => {
        const component = shallow(<QuoteSummary
            quote={{id:1}}
            quoteParts={[]}
            brands={[]}
            sections={[]}
            parts={[]}
            bikeParts={[]}
            bikes={[]}
        />);
        expect (findDataTest(component, 'no-summary')).toHaveLength(1);
        expect (findDataTest(component, 'quote-summary-headers')).toHaveLength(0);
        expect (component.find('QuoteSummaryPartType')).toHaveLength(0);
    });
    it('should render headers and detail when there is part type data', () => {
        const component = shallow(<QuoteSummary
            quote={{id:1}}
            quoteParts={[{quote:1, partType:1}]}
            brands={[]}
            sections={sampleSections}
            parts={[]}
            bikeParts={[]}
            bikes={[]}
        />);
        expect (findDataTest(component, 'no-summary')).toHaveLength(0);
        expect (findDataTest(component, 'quote-summary-headers')).toHaveLength(1);
        expect (component.find('QuoteSummaryPartType')).toHaveLength(1);
    });
});