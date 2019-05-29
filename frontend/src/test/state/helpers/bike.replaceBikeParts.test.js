import {replaceBikeParts} from "../../../state/helpers/bike";

test('should not remove any parts when none match and none are passed', () => {
    const bikeId = 1;
    const oldBikeParts = [
        { id: 211, bike: 2, part: 21 },
        { id: 122, bike: 2, part: 22 },
    ];
    const newBikeParts = [];
    expect(replaceBikeParts(bikeId, newBikeParts, oldBikeParts)).toEqual(oldBikeParts)
});
test('should remove arts for bike and add new parts when some match and some are passed', () => {
    const bikeId = 1;
    const oldBikeParts = [
        { id: 1211, bike: 1, part: 21 },
        { id: 221, bike: 2, part: 21 },
        { id: 122, bike: 1, part: 22 },
        { id: 222, bike: 2, part: 22 },
    ];
    const newBikeParts = [
        { id: 131, bike: 1, part: 31 },
        { id: 132, bike: 1, part: 32 },
    ];
    const exectedBikeParts = [
        { id: 221, bike: 2, part: 21 },
        { id: 222, bike: 2, part: 22 },
        { id: 131, bike: 1, part: 31 },
        { id: 132, bike: 1, part: 32 },
    ];
    expect(replaceBikeParts(bikeId, newBikeParts, oldBikeParts)).toEqual(exectedBikeParts)
});
test('should remove all parts when all match and no new are passed', () => {
    const bikeId = 2;
    const oldBikeParts = [
        { id: 211, bike: 2, part: 21 },
        { id: 122, bike: 2, part: 22 },
    ];
    const newBikeParts = [];
    expect(replaceBikeParts(bikeId, newBikeParts, oldBikeParts)).toEqual([])
});