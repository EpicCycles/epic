export const assertComponentHasExpectedProps = (component, expectedProps) =>
    Object.entries(expectedProps, ([propName, propValue]) => {
        if (propValue === 'function') {
            expect(
                component.prop(propName),
                `${propName} should be an instance of a function`
            ).to.be.instanceOf(Function);
            return;
        }
        expect(
            component.prop(propName),
            `${propName} should equal ${propValue}`
        ).to.eql(propValue);
    });
