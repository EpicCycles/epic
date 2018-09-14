import React from 'react';

import { validateEmailFormat } from "../../helpers/utils";

describe("validateEmailFormat tests", () => {
    it('tests correctly for valid email address', () => {
        expect(validateEmailFormat('anna.weaverhr6@gmail.com')).toBe(true);
    });
    it('tests correctly for invalid email address', () => {
        expect(validateEmailFormat('anna.weaverhr6@gmail')).toBe(false);
        expect(validateEmailFormat('anna.weaverhr6')).toBe(false);
        expect(validateEmailFormat('anna.weaverhr6@b.c')).toBe(false);
        expect(validateEmailFormat('@gmail')).toBe(false);
        expect(validateEmailFormat('@gmail.com')).toBe(false);
    });
});