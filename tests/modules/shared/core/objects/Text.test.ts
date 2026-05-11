import InvalidParameters from "../../../../../src/modules/shared/core/errors/InvalidParameters";
import Text from "../../../../../src/modules/shared/core/objects/Text";

describe('Text object tests', () => {
    it('Should create a valid instante of Text', () => {
        const text = new Text('this is a valid text');
        expect(text).toBeInstanceOf(Text);
    });

    it('Should throw if the text is no valid', () => {
        expect(() => new Text('')).toThrow(InvalidParameters);
        expect(() => new Text(undefined)).toThrow(InvalidParameters);
    });
});
