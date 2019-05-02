import {quoteDescription} from "../quote";
import {sampleBikes, sampleBrands, sampleFrames} from "../../../../helpers/sampleData";

describe('quoteDescription', () => {
    const customers = [
        {id: 23, first_name: 'Fred', last_name: 'Smith', email:'a@c.com'}
    ];
    it('should return a parts only description when no bike is passed', () => {
        const quoteDescriptionResult = quoteDescription(23, undefined, customers, sampleFrames, sampleBikes, sampleBrands);
        expect(quoteDescriptionResult.startsWith('Fred Smith/Parts only')).toBeTruthy();
    });
    it('should cope when no customer data is found', () => {
        const quoteDescriptionResult = quoteDescription(23, undefined, [], sampleFrames, sampleBikes, sampleBrands);
        expect(quoteDescriptionResult.startsWith('Parts only')).toBeTruthy();
    });
    it('should return a bike description when a bike is passed', () => {
        const quoteDescriptionResult = quoteDescription(23, 58, customers, sampleFrames, sampleBikes, sampleBrands);
        expect(quoteDescriptionResult).toMatch('Fred Smith/Haibike: Trekking 4');
        expect(quoteDescriptionResult.startsWith('Fred Smith/Haibike: Trekking 4')).toBeTruthy();
    });
    it('should cope when no bike is found', () => {
        const quoteDescriptionResult = quoteDescription(23, 58, customers, sampleFrames, [], sampleBrands);
        expect(quoteDescriptionResult.startsWith('Fred Smith/Bike')).toBeTruthy();
    });
});