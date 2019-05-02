import React from 'react';
import QuoteSummary from "../QuoteSummary";
import {assertComponentHasExpectedProps, findDataTest} from "../../../../../test/jest_helpers/assert";
import {sampleBikes, sampleBrands, sampleFrames} from "../../../helpers/sampleData";

describe('QuoteSummary', () => {
    const sections = [
        {
            id: 1,
            partTypes: [{ id: 1 }, { id: 2 }]
        },
        {
            id: 2,
            partTypes: [{ id: 21 }, { id: 22 }]
        },
    ]
    it('should render message only when no part type data', () => {
        const component = shallow(<QuoteSummary
            quote={{ id: 1 }}
            quoteParts={[]}
            brands={[]}
            sections={sections}
            parts={[]}
            bikeParts={[]}
            bikes={[]}
        />);
        expect(component.find('ViewModelBlock')).toHaveLength(1);
        const partData = component.find('QuoteSummaryParts');
        expect(partData).toHaveLength(1);
        assertComponentHasExpectedProps(partData, {
            quoteParts: [],
            bikeParts: [],
            bikes: [],
        })
    });
    it('should render headers and detail when there is part type data', () => {
        const component = shallow(<QuoteSummary
            quote={{ id: 1 }}
            quoteParts={[{ quote: 1, partType: 1 }, { quote: 2, partType: 1 }]}
            brands={[]}
            sections={sections}
            parts={[]}
            bikeParts={[]}
            bikes={[]}
        />);
        expect(component.find('ViewModelBlock')).toHaveLength(1);
        const partData = component.find('QuoteSummaryParts');
        expect(partData).toHaveLength(1);
        assertComponentHasExpectedProps(partData, {
            quoteParts: [{ quote: 1, partType: 1 }],
            bikeParts: [],
            bikes: [],
        })
    });
    it('should render headers and all section detail when there is part type data', () => {
        const component = shallow(<QuoteSummary
            quote={{ id: 1 }}
            quoteParts={[{ quote: 1, partType: 1 }, { quote: 1, partType: 22 }]}
            brands={[]}
            sections={sections}
            parts={[]}
            bikeParts={[]}
            bikes={[]}
        />);
        expect(component.find('ViewModelBlock')).toHaveLength(1);
        const partData = component.find('QuoteSummaryParts');
        expect(partData).toHaveLength(1);
        assertComponentHasExpectedProps(partData, {
            quoteParts: [{ quote: 1, partType: 1 }, { quote: 1, partType: 22 }],
            bikeParts: [],
        })
    });
    it('should render bike parts and section details when a bike is present on quote', () => {
        const component = shallow(<QuoteSummary
            quote={{ id: 1, bike: 58 }}
            quoteParts={[{ quote: 1, partType: 1 }, { quote: 1, partType: 22 }]}
            brands={sampleBrands}
            sections={sections}
            parts={[
                {id: 15, partType: 1},
                {id: 25, partType: 1},
                {id: 35, partType: 22},
            ]}
            bikeParts={[
                {bike:58, part: 15},
                {bike:68, part: 25},
                {bike:58, part: 35},
            ]}
            bikes={sampleBikes}
            frames={sampleFrames}
        />);
        expect(component.find('ViewModelBlock')).toHaveLength(1);
        const partData = component.find('QuoteSummaryParts');
        expect(partData).toHaveLength(1);
        assertComponentHasExpectedProps(partData, {
            quoteParts: [{ quote: 1, partType: 1 }, { quote: 1, partType: 22 }],
            bikeParts: [{id: 15, partType: 1},{id: 35, partType: 22},],
        })
    })
});