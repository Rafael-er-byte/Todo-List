import InvalidParameters from "../../../../../src/modules/shared/core/errors/InvalidParameters";
import Version from "../../../../../src/modules/shared/core/objects/Version";
import { describe, it, expect } from 'vitest';

describe('Version', () => {
    it('should create a version object with the correct properties', () => {
        const version = new Version(1);   
        expect(version.valueOf()).toBe(1);
    });

    it('should increment the version number', () => {
        const version = new Version(1);
        const newVersion = version.increment();
        expect(newVersion.valueOf()).toBe(2);
    });

    it('Should just allow integer positive values', () => {
        expect(() => new Version(1.5)).toThrow(InvalidParameters);
        expect(() => new Version(-1.5)).toThrow(InvalidParameters);
        expect(() => new Version(-1)).toThrow(InvalidParameters);   
        expect(() => new Version('1' as unknown as number)).toThrow(InvalidParameters);
        expect(() => new Version('' as unknown as number)).toThrow(InvalidParameters);
        expect(() => new Version(undefined as unknown as number)).toThrow(InvalidParameters);
    });
});    