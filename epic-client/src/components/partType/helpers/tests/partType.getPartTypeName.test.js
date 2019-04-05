import {getPartTypeName} from "../partType";
import {sampleSections} from "../../../../helpers/sampleData";

describe('getPartTypeName', () => {
    it('should return undefined when no id is passed', () => {
        expect(getPartTypeName()).not.toBeDefined();
    })
    it('should return string when id is passed that is not in list', () => {
        expect(getPartTypeName(12345, sampleSections)).toBe('Unknown Part Type');
    })
    it('should return name when id is passed that is in list', () => {
        expect(getPartTypeName(2, sampleSections)).toBe('Fork');
    })
});