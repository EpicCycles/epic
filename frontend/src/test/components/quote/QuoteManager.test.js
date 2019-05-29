import React from 'react';
import QuoteManager from "../../../components/quote/QuoteManager";
import {sampleBrands, sampleSections, sampleSuppliers} from "../../../helpers/sampleData";
import {assertComponentHasExpectedProps, findDataTest} from "../../jest_helpers/assert";

const props = {
    bikes: [],
    bikeParts: [],
    brands: sampleBrands,
    sections: sampleSections,
    suppliers: sampleSuppliers,
    parts: [],
    frames: [],
    quoteId: 2,
    quotes: [{ id: 2 }],
    saveBrands: jest.fn(),
    getFrameList: jest.fn(),
    listParts: jest.fn(),
    getCustomerList: jest.fn(),
    getCustomerListPage: jest.fn(),
    getCustomer: jest.fn(),
    clearCustomerState: jest.fn(),
    createCustomer: jest.fn(),
    saveCustomer: jest.fn(),
    deleteCustomer: jest.fn(),
    removeCustomer: jest.fn(),
    createNote: jest.fn(),
    saveNote: jest.fn(),
    removeNote: jest.fn(),
    deleteNote: jest.fn(),
    saveCustomerPhone: jest.fn(),
    deleteCustomerPhone: jest.fn(),
    saveCustomerAddress: jest.fn(),
    deleteCustomerAddress: jest.fn(),
    isLoading: false,
};

describe('QuoteManager', () => {
    describe('basic rendering', () => {
        test('should render with tab 0 and relevant compoents when initially loaded', () => {
            const component = shallow(<QuoteManager {...props}/>);
            const TabbedView = component.find('TabbedView');
            expect(TabbedView).toHaveLength(1);
            assertComponentHasExpectedProps(TabbedView, {
                currentTab: 2
            });

            expect(findDataTest(component, "customer-tab")).toHaveLength(0);
            expect(findDataTest(component, "bike-quotes-tab")).toHaveLength(0);
            expect(findDataTest(component, "quote-list-tab")).toHaveLength(0);
            expect(findDataTest(component, "quote-detail-tab")).toHaveLength(1);
            expect(findDataTest(component, "quote-history-tab")).toHaveLength(0);
        });
    });
    describe('tab handling with data', () => {
        let component;

        beforeEach(() => {
            component = shallow(<QuoteManager {...props}/>);
        });
        test('should render with tab 1 and relevant components when second tab clicked', () => {
            let TabbedView = component.find('TabbedView');
            expect(TabbedView).toHaveLength(1);
            assertComponentHasExpectedProps(TabbedView, {
                currentTab: 2
            });
            component.instance().changeCurrentTab(1);
            component.update();
            expect(component.state('tab')).toBe(1);
             TabbedView = component.find('TabbedView');
            expect(TabbedView).toHaveLength(1);
            assertComponentHasExpectedProps(TabbedView, {
                currentTab: 1
            });

            expect(findDataTest(component, "customer-tab")).toHaveLength(0);
            expect(findDataTest(component, "quote-list-tab")).toHaveLength(1);
            expect(findDataTest(component, "bike-quotes-tab")).toHaveLength(0);
            expect(findDataTest(component, "quote-detail-tab")).toHaveLength(0);
            assertComponentHasExpectedProps(component.find('QuoteDetail'), {
                quote: { id: 2 }
            });
            expect(findDataTest(component, "quote-history-tab")).toHaveLength(0);
        });
        test('should render with tab 0 and relevant components when first tab clicked', () => {
            let TabbedView = component.find('TabbedView');
            expect(TabbedView).toHaveLength(1);
            assertComponentHasExpectedProps(TabbedView, {
                currentTab: 2
            });
            component.instance().changeCurrentTab(0);
            component.update();
            expect(component.state('tab')).toBe(0);
            TabbedView = component.find('TabbedView');
            expect(TabbedView).toHaveLength(1);
            assertComponentHasExpectedProps(TabbedView, {
                currentTab: 0
            });

            expect(findDataTest(component, "customer-tab")).toHaveLength(1);
            expect(findDataTest(component, "bike-quotes-tab")).toHaveLength(0);
            expect(findDataTest(component, "quote-detail-tab")).toHaveLength(0);

            expect(findDataTest(component, "quote-list-tab")).toHaveLength(0);
        });
        test('should render with tab 3 and relevant components when fourth tab clicked', () => {
            component.instance().changeCurrentTab(3);
            component.update();
            expect(component.state('tab')).toBe(3);
            const TabbedView = component.find('TabbedView');
            expect(TabbedView).toHaveLength(1);
            assertComponentHasExpectedProps(TabbedView, {
                currentTab: 3
            });

            expect(findDataTest(component, "customer-tab")).toHaveLength(0);
            expect(findDataTest(component, "quote-list-tab")).toHaveLength(0);
            expect(findDataTest(component, "quote-detail-tab")).toHaveLength(0);
            expect(findDataTest(component, "quote-history-tab")).toHaveLength(1);
            expect(findDataTest(component, "bike-quotes-tab")).toHaveLength(0);
        });
        test('should render with tab 4 and relevant components when fourth tab clicked', () => {
            component.instance().changeCurrentTab(4);
            component.update();
            expect(component.state('tab')).toBe(4);
            const TabbedView = component.find('TabbedView');
            expect(TabbedView).toHaveLength(1);
            assertComponentHasExpectedProps(TabbedView, {
                currentTab: 3
            });

            expect(findDataTest(component, "customer-tab")).toHaveLength(0);
            expect(findDataTest(component, "quote-list-tab")).toHaveLength(0);
            expect(findDataTest(component, "quote-detail-tab")).toHaveLength(0);
            expect(findDataTest(component, "quote-history-tab")).toHaveLength(0);
            expect(findDataTest(component, "bike-quotes-tab")).toHaveLength(1);
        });
    });
});