import {findPartsForBike} from "../../../../components/bike/helpers/bike";


test('should return and empty array when there is no bike', () => {
    expect(findPartsForBike()).toEqual([]);
});
test('should return an empty array when there is a bike but no bike parts matching', () => {
    const bike = {
        "id": 58,
        "frame_name": "Haibike: Trekking",
        "model_name": "4",
        "description": null,
        "colours": "anthracite/black/lime",
        "rrp": null,
        "epic_price": null,
        "club_price": "2249.00",
        "sizes": null,
        "frame": 14
    };
    const bikeParts = [];
    const parts = [];
    expect(findPartsForBike(bike, bikeParts, parts)).toEqual([]);
});
test('should return an array of parts when bke has parts', () => {
    const bike = {
        "id": 58,
        "frame_name": "Haibike: Trekking",
        "model_name": "4",
        "description": null,
        "colours": "anthracite/black/lime",
        "rrp": null,
        "epic_price": null,
        "club_price": "2249.00",
        "sizes": null,
        "frame": 14
    };
    const bikeParts =  [
        {
            "id": 1476,
            "bike": 58,
            "part": 1
        },
        {
            "id": 1477,
            "bike": 58,
            "part": 345
        },
       {
            "id": 1477,
            "bike": 68,
            "part": 347
        },
    ];
    const parts = [
        {
            "id": 1,
            "part_name": "aluminium 6061 HD Interface quick-release 5 x 135mm disc brake Post Mount",
            "trade_in_price": null,
            "standard": false,
            "stocked": false,
            "partType": 1,
            "brand": 3
        },
        {
            "id": 345,
            "part_name": "Part 345",
            "trade_in_price": null,
            "standard": false,
            "stocked": false,
            "partType": 1,
            "brand": 3
        },
        {
            "id": 347,
            "part_name": "part 347",
            "trade_in_price": null,
            "standard": false,
            "stocked": false,
            "partType": 1,
            "brand": 3
        },
    ];
    expect(findPartsForBike(bike, bikeParts, parts)).toEqual([parts[0], parts[1]]);
});
