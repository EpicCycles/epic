import React from "react";
import SupplierEdit from "../SupplierEdit";
import {Icon} from "semantic-ui-react";

test("displays correctly for new supplier", () => {
    const component = shallow(<SupplierEdit/>);
    expect(component).toMatchSnapshot();
});
test("displays correctly for existing supplier", () => {
    const supplier = {
        id: 1,
        supplier_name: "supplier name",
        brand_names: ["brands 1", "brand 2", "brand 3"],
        website: "supplier.co.uk",
        preferred_supplier: false,
    };
    const component = shallow(<SupplierEdit
        supplier={supplier}
    />);
    expect(component).toMatchSnapshot();
});
test("displays correctly for existing supplier as a modal dialogue", () => {
    const supplier = {
        id: 1,
        supplier_name: "supplier name",
        brand_names: ["brands 1", "brand 2", "brand 3"],
        website: "supplier.co.uk",
        preferred_supplier: false,
    };
    const closeModal = jest.fn();
    const component = shallow(<SupplierEdit
        supplier={supplier}
        closeModal={closeModal}
    />);
    expect(component).toMatchSnapshot();
});
test("removing name for a supplier leads to an error being shown", () => {
    const supplier = {
        id: 1,
        supplier_name: "supplier name",
        brand_names: ["brands 1", "brand 2", "brand 3"],
        website: "supplier.co.uk",
        preferred_supplier: false,
    };
    const component = shallow(<SupplierEdit
        supplier={supplier}
    />);
    component.instance().handleInputChange("supplier_name","");
    expect(component.state('supplier_name')).toBe("");
    expect(component.state('website')).toBe(supplier.website);
    expect(component.state('preferred_supplier')).toBe(supplier.preferred_supplier);
    expect(component.state('nameError')).toBe("Supplier name must be provided");
    expect(component.state('isValid')).toBeFalsy();

    expect(component.instance().checkForChanges()).toBeTruthy();
    // expect(component.find(Icon).length).toBe(3);

    component.instance().handleInputChange("supplier_name","Replacement name");
    expect(component.state('supplier_name')).toBe("Replacement name");
    expect(component.state('website')).toBe(supplier.website);
    expect(component.state('preferred_supplier')).toBe(supplier.preferred_supplier);
    expect(component.state('nameError')).toBe("");
    expect(component.state('isValid')).toBeTruthy();

    expect(component.instance().checkForChanges()).toBeTruthy();
    // expect(component.find(Icon).length).toBe(4);

    component.instance().onClickReset();
    expect(component.state('supplier_name')).toBe(supplier.supplier_name);

    expect(component.find(Icon).length).toBe(1);
});
test("save for existing supplier saves all changes", () => {
    const saveSupplier = jest.fn();
    const closeModal = jest.fn();
    const supplier = {
        id: 1,
        supplier_name: "supplier name",
        brand_names: ["brands 1", "brand 2", "brand 3"],
        website: "supplier.co.uk",
        preferred_supplier: false,
    };
    const component = shallow(<SupplierEdit
        supplier={supplier}
        saveSupplier={saveSupplier}
        closeModal={closeModal}
    />);

    component.instance().handleInputChange("supplier_name","Replacement name");
    component.instance().handleInputChange("preferred_supplier", true);
    component.instance().handleInputChange("website","website.supplier.co.uk");
    component.instance().saveOrCreateSupplier();
    expect(saveSupplier.mock.calls.length).toBe(1);
    expect(closeModal.mock.calls.length).toBe(1);
    expect(saveSupplier.mock.calls[0][0].id).toBe(supplier.id);
    expect(saveSupplier.mock.calls[0][0].supplier_name).toBe("Replacement name");
    expect(saveSupplier.mock.calls[0][0].brand_names).toBe(supplier.brand_names);
    expect(saveSupplier.mock.calls[0][0].website).toBe("website.supplier.co.uk");
    expect(saveSupplier.mock.calls[0][0].preferred_supplier).toBe(true);
});
test("save for new supplier saves all changes", () => {
    const saveSupplier = jest.fn();
    const closeModal = jest.fn();
    const supplier = {};
    const component = shallow(<SupplierEdit
        supplier={supplier}
        saveSupplier={saveSupplier}
        closeModal={closeModal}
    />);

    component.instance().handleInputChange("supplier_name","Replacement name");
    component.instance().handleInputChange("preferred_supplier", false);
    component.instance().handleInputChange("website","website.supplier.co.uk");
    component.instance().saveOrCreateSupplier();
    expect(saveSupplier.mock.calls.length).toBe(1);
    expect(closeModal.mock.calls.length).toBe(1);
    expect(saveSupplier.mock.calls[0][0].id).toBe(undefined);
    expect(saveSupplier.mock.calls[0][0].supplier_name).toBe("Replacement name");
    expect(saveSupplier.mock.calls[0][0].brand_names).toBe(undefined);
    expect(saveSupplier.mock.calls[0][0].website).toBe("website.supplier.co.uk");
    expect(saveSupplier.mock.calls[0][0].preferred_supplier).toBe(false);
});
test("delete for existing supplier calls passed method", () => {
    const deleteSupplier = jest.fn();
    const closeModal = jest.fn();
    const supplier = {
        id: 1,
        supplier_name: "supplier name",
        brand_names: ["brands 1", "brand 2", "brand 3"],
        website: "supplier.co.uk",
        preferred_supplier: false,
    };
    const component = shallow(<SupplierEdit
        supplier={supplier}
        deleteSupplier={deleteSupplier}
        closeModal={closeModal}
    />);

    component.instance().handleInputChange("supplier_name","Replacement name");
    component.instance().handleInputChange("preferred_supplier", true);
    component.instance().handleInputChange("website","website.supplier.co.uk");
    component.instance().deleteOrRemoveSupplier();
    expect(deleteSupplier.mock.calls.length).toBe(1);
    expect(closeModal.mock.calls.length).toBe(1);
    expect(deleteSupplier.mock.calls[0][0]).toBe(supplier.id);
});
test("delete on modal for new supplier just closes modal", () => {
    const deleteSupplier = jest.fn();
    const closeModal = jest.fn();
    const supplier = {};
    const component = shallow(<SupplierEdit
        supplier={supplier}
        deleteSupplier={deleteSupplier}
        closeModal={closeModal}
    />);

    component.instance().handleInputChange("supplier_name","Replacement name");
    component.instance().handleInputChange("preferred_supplier", true);
    component.instance().handleInputChange("website","website.supplier.co.uk");
    component.instance().deleteOrRemoveSupplier();
    expect(deleteSupplier.mock.calls.length).toBe(0);
    expect(closeModal.mock.calls.length).toBe(1);
});
