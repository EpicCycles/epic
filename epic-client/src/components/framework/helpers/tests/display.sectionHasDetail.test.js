import {sectionHasDetail} from "../display";

describe('sectionHasDetail', () => {
    it('should return false when section has no partTypes', () => {
        const section = { id: 1 };
        const objectsToCheck = [{ id: 1, partType: 21 }];
        expect(sectionHasDetail(section, objectsToCheck)).toBeFalsy();
    });
    it('should return false when section has empty part types array', () => {
        const section = { id: 1, partTypes: [] };
        const objectsToCheck = [{ id: 1, partType: 21 }];
        expect(sectionHasDetail(section, objectsToCheck)).toBeFalsy();
    });
    it('should return false when section part types are not in check objects', () => {
        const section = { id: 1, partTypes: [] };
        const objectsToCheck = [{ id: 1, partType: 21 }];
        expect(sectionHasDetail(section, objectsToCheck)).toBeFalsy();
    });
    it('should return false when there are no check objects', () => {
        const section = { id: 1, partTypes: [] };
        expect(sectionHasDetail(section)).toBeFalsy();
    });
    it('should return false when there are no check objects in passed array', () => {
        const section = { id: 1, partTypes: [] };
        const objectsToCheck = [];
        expect(sectionHasDetail(section, objectsToCheck)).toBeFalsy();
    });
    it('should return false when there are no check objects matching part types', () => {
        const section = { id: 1, partTypes: [{ id: 1 }, { id: 2 }] };
        const objectsToCheck = { id: 1, partType: 21 };
        expect(sectionHasDetail(section, objectsToCheck)).toBeFalsy();
    });
    it('should return true when there is one check objects matching part types', () => {
        const section = { id: 1, partTypes: [{ id: 1 }, { id: 21 }, { id: 2 }] };
        const objectsToCheck = [{ id: 1, partType: 34 }, { id: 1, partType: 21 }];
        expect(sectionHasDetail(section, objectsToCheck)).toBeTruthy();
    });
    it('should return true when there is more than one check objects matching part types', () => {
        const section = { id: 1, partTypes: [{ id: 1 }, { id: 21 }, { id: 2 }] };
        const objectsToCheck = [{ id: 1, partType: 2 }, { id: 1, partType: 34 }, { id: 1, partType: 21 }];
        expect(sectionHasDetail(section, objectsToCheck)).toBeTruthy();
    });
});