import React from 'react';
import BikeEdit from "../BikeEdit";
import {assertComponentHasExpectedProps} from "../../../../test/assert";
import {bikeFields} from "../../app/model/helpers/fields";
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
xit('should show the bike name and bike edit page when rendered', () => {
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
    const props = {
        bike,
        brands,
        frames,
        saveBike:jest.fn(),
        deleteBike:jest.fn(),
    };
    const component = shallow(<BikeEdit
        {...props}
    />);
    expect(component).toMatchSnapshot();
    const modelEdit = component.find('EditModelPage');
    assertComponentHasExpectedProps(modelEdit, {
        model: props.bike,
        persistedModel: props.bike,
        modelFields: bikeFields,
    });
});