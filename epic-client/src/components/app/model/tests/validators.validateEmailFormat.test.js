import React from 'react';
import {validateEmailFormat} from "../helpers/validators";
import {INVALID_EMAIL} from "../helpers/error";


describe("validateEmailFormat tests", () => {
    it('tests correctly for valid email address', () => {
        expect(validateEmailFormat('anna.weaverhr6@gmail.com')).toBe(undefined);
    });
    it('tests correctly for invalid email address', () => {
        expect(validateEmailFormat('anna.weaverhr6@gmail')).toBe(INVALID_EMAIL);
        expect(validateEmailFormat('anna.weaverhr6')).toBe(INVALID_EMAIL);
        expect(validateEmailFormat('anna.weaverhr6@b.c')).toBe(INVALID_EMAIL);
        expect(validateEmailFormat('@gmail')).toBe(INVALID_EMAIL);
        expect(validateEmailFormat('@gmail.com')).toBe(INVALID_EMAIL);
    });
});