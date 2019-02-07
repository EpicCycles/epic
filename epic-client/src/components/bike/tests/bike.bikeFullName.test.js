import {bikeFullName} from "../helpers/bike_helpers";

const frames = [
    {
        "id": 14,
        "brand_name": "Haibike",
        "frame_name": "Trekking",
        "archived": false,
        "archived_date": null,
        "brand": 3
    },
    {
        "id": 13,
        "brand_name": "Haibike",
        "frame_name": "Urban",
        "archived": false,
        "archived_date": null,
        "brand": 3
    },
    {
        "id": 27,
        "brand_name": "Raleigh",
        "frame_name": "Motus",
        "archived": false,
        "archived_date": null,
        "brand": 4
    }
];
const brands = [
    { brand_name: "Bianchi", link: "https://bianchi.co.uk", id: 8 },
    { brand_name: "Haibike", id: 3 },
];
test('should return bike with frame_name when bike has that as attribute', () => {
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
    expect(bikeFullName(bike, frames, brands)).toBe("Haibike: Trekking 4");
});
test('should return bike with frame name and brand when frame is found', () => {
    const bike = {
        "id": 58,
        "model_name": "4",
        "description": null,
        "colours": "anthracite/black/lime",
        "rrp": null,
        "epic_price": null,
        "club_price": "2249.00",
        "sizes": null,
        "frame": 14
    };
    expect(bikeFullName(bike, frames, brands)).toBe("Haibike: Trekking 4");
});
test('should return bike with name when frame is not found', () => {
    const bike = {
        "id": 58,
        "model_name": "4",
        "description": null,
        "colours": "anthracite/black/lime",
        "rrp": null,
        "epic_price": null,
        "club_price": "2249.00",
        "sizes": null,
        "frame": 14
    };
    expect(bikeFullName(bike, frames, brands)).toBe("Haibike: Trekking 4");
});