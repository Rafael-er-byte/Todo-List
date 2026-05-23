import InvalidFormat from "../../../../../src/modules/shared/core/errors/InvalidFormat";
import ID from "../../../../../src/modules/shared/core/objects/ID";
import { describe, it, expect } from 'vitest';

describe("ID tests", () => {
    it('Should create a valid ID instance', () => {
        const id = ID.generateId();
        expect(id).toBeInstanceOf(ID);
        expect(id.getId()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it("Should create a valid instance of ID from a string", () => {
        const id = ID.fromString('0195f3a2-7b4d-7e8f-9a1b-3c2d4e5f6a7b');
        expect(id).toBeInstanceOf(ID);
        expect(id.getId()).toBe('0195f3a2-7b4d-7e8f-9a1b-3c2d4e5f6a7b');
    });

    it("Should create and validate valid uuid v7", () => {
        const validUuidV7 = ID.generateId().getId();
        const id = ID.fromString(validUuidV7);
        expect(id).toBeInstanceOf(ID);
        expect(id.getId()).toBe(validUuidV7);
    });

    it('Should throw if the ID string is not a valid UUIDv7', () => {
        expect(() => ID.fromString('invalid-id')).toThrow();
    });

    it("Should throw if the ID string is a valid UUID but not version 7", () => {
        expect(() => ID.fromString('123e4567-e89b-12d3-a456-426614174000')).toThrow();
        expect(() => ID.fromString('550e8400-e29b-41d4-a716-446655440000')).toThrow();
    });

    it("Should throw if the ID string is empty", () => {
        expect(() => ID.fromString('')).toThrow();
    });

    it("Should throw if the ID string is null or undefined", () => {
        expect(() => ID.fromString(null as unknown as string)).toThrow();
        expect(() => ID.fromString(undefined as unknown as string)).toThrow();
    });                    

    it("Should throw if the ID string has invalid characters", () => {
        expect(() => ID.fromString('0195f3a2-7b4d-7e8f-9a1b-3c2d4e5f6a7z')).toThrow();
    });

    it("Should throw an InvalidFormat error with details when the ID string is invalid", () => {
        try {
            ID.fromString('invalid-id');
        } catch (error) {
            expect(error).toBeInstanceOf(InvalidFormat);
            if(error instanceof InvalidFormat) {
                expect(error.message).toBe('Invalid ID format. Expected a UUIDv7 string.');
                expect(error.info).toEqual({ id: 'invalid-id' });
            }
        }
    });
});