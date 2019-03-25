import {quoteDescription} from "../quote";
import {sampleBikes, sampleBrands, sampleFrames} from "../../../../helpers/sampleData";

describe('quoteDescription', () => {
    it('should return a parts only description when no bike is passed', () => {
        const quoteDescriptionResult = quoteDescription(undefined, sampleFrames, sampleBikes, sampleBrands);
        expect(quoteDescriptionResult.startsWith('Parts only')).toBeTruthy();
    })
    it('should return a bike description when a bike is passed', () => {
        const quoteDescriptionResult = quoteDescription(58, sampleFrames, sampleBikes, sampleBrands);
        expect(quoteDescriptionResult.startsWith('Haibike: Trekking 4')).toBeTruthy();
    })
})