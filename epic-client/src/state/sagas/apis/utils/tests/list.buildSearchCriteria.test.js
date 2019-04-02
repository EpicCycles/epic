import {buildSearchCriteria} from "../list";

dscribe('buildSearchCriteria', () => {
    it('should add no criteria when an empty object is passed', () => {
        expect(buildSearchCriteria({})).toBe('');
    })
    it('should add no criteria when no object is passed', () => {
        expect(buildSearchCriteria()).toBe('');
    })
    it('should add a single criteria when an object with one value is passed', () => {
        expect(buildSearchCriteria({first_name:'Fred'})).toBe('?first_name=Fred');
    })
    it('should add multiple criteria when an object with many values is passed', () => {
        expect(buildSearchCriteria({first_name:'Fred', last_name:'Jones', archived:true})).toBe('?first_name=Fred&last_name=Jones&archived=true');
    })
})