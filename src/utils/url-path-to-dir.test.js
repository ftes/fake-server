import { dirGenerator } from './url-path-to-dir';

describe('url path to dir', () => {
  describe('dir generator', () => {
    it('should return path value and * for single path segment', () => {
      const input = ['a'];
      const output = Array.from(dirGenerator(input));
      expect(output).toEqual([['a'], ['*']]);
    });

    it('should return dirs in correct order for two path segments', () => {
      const input = ['a', 'b'];
      const output = Array.from(dirGenerator(input));
      expect(output).toEqual([
        ['a', 'b'],
        ['*', 'b'],
        ['a', '*'],
        ['*', '*'],
      ]);
    });

    it('should return dirs in correct order for three path segments', () => {
      const input = ['a', 'b', 'c'];
      const output = Array.from(dirGenerator(input));
      expect(output).toEqual([
        ['a', 'b', 'c'],
        ['*', 'b', 'c'],
        ['a', '*', 'c'],
        ['*', '*', 'c'],
        ['a', 'b', '*'],
        ['*', 'b', '*'],
        ['a', '*', '*'],
        ['*', '*', '*'],
      ]);
    });
  });
});
