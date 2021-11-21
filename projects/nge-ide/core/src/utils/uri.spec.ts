import { URI } from 'vscode-uri';
import { compareURI } from './uri';

describe('Uri', () => {
    it('should compareUris works', () => {
        expect(
            compareURI(URI.parse('folder/a.txt'), URI.parse('folder/a.txt'))
        ).toBe(true);

        expect(
            compareURI(URI.parse('folder/a.txt#fragment'), URI.parse('folder/a.txt'))
        ).toBe(true);

        expect(
            compareURI(URI.parse('folder/a.txt'), URI.parse('folder/a.txt?query=10'))
        ).toBe(true);

        expect(
            compareURI(URI.parse('folder/a.txt#fragment'), URI.parse('folder/a.txt?query=10'))
        ).toBe(true);

        expect(
            compareURI(URI.parse('folder/a.txt'), URI.parse('folder/b.txt'))
        ).toBe(false);
    });
});

