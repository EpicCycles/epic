import React from "react";
import SupplierBlob from "../SupplierBlob";

test("supplier blob with just name", () => {
    const supplier = {
        id: 1,
        supplier_name: "supplier name",
        brand_names: ["brands 1", "brand 2", "brand 3"],
        website: "supplier.co.uk"
    };
    const component = shallow(<SupplierBlob
        supplier={supplier}
        componentKey={supplier.id}
    />);
    expect(component).toMatchSnapshot();
});
test("supplier blob with everything", () => {
    const supplier = {
        id: 1,
        supplier_name: "supplier name",
        brand_names: ["brands 1", "brand 2", "brand 3"],
        website: "supplier.co.uk"
    };
    const removeFunction = jest.fn();
    const editFunction = jest.fn();

    const component = shallow(<SupplierBlob
        supplier={supplier}
        componentKey={supplier.id}
        showBrands={true}
        showWebsite={true}
        allowRemoval={true}
        removeFunction={removeFunction}
        allowEdit={true}
        editFunction={editFunction}
    />);
    expect(component).toMatchSnapshot();
});