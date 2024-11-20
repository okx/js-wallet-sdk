import {isHexString, validateHexString} from "../src/base";

describe('validateHexString', () => {
    it('returns true for valid hex string with 0x prefix', () => {
        expect(validateHexString('0x1a2b3c')).toBe(true);
    });

    it('returns true for valid hex string without 0x prefix', () => {
        expect(validateHexString('1a2b3c')).toBe(true);
    });
    it('returns true for valid hex string with 0X prefix', () => {
        expect(validateHexString('0X1A2B3C')).toBe(true);
    });

    it('returns false for invalid hex string', () => {
        expect(validateHexString('0x1g2h3i')).toBe(false);
    });

    it('returns false for empty string', () => {
        expect(validateHexString('')).toBe(false);
    });
    it('returns false for 0x string', () => {
        expect(validateHexString('0x')).toBe(false);
    });
    it('returns false for 0X string', () => {
        expect(validateHexString('0X')).toBe(false);
    });
    it('returns true for valid hex string with chinese', () => {
        expect(validateHexString('0x1a2b3c中文')).toBe(false);
    });
    it('returns true for valid hex string with space', () => {
        expect(validateHexString('0x1a2b3c abcdef')).toBe(false);
    });
    it('returns true for valid hex string with chinese and space ', () => {
        expect(validateHexString('0x1a2b3c 中文')).toBe(false);
    });

    it('returns false for valid hex string with odd length', () => {
        expect(validateHexString('0x1a2b3cf')).toBe(false);
    });

    it('returns false for valid hex string without odd length', () => {
        expect(validateHexString('1a2b3cf')).toBe(false);
    });

});