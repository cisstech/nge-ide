import { stringFromByArray, stringToByteArray } from './strings';

describe('Strings', () => {
  it('should stringFromByArray and stringToByteArray be symetric', () => {
    expect(stringToByteArray('')).toEqual(stringToByteArray(''));
    expect(stringToByteArray('a')).toEqual(stringToByteArray('a'));
    expect(stringToByteArray('a$')).toEqual(stringToByteArray('a$'));
    expect(stringToByteArray('a$')).not.toEqual(stringToByteArray(''));
    expect(stringFromByArray(stringToByteArray('a$'))).toEqual('a$');
  });
});
