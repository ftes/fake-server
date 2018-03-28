
/* eslint-disable no-underscore-dangle */

import fs from 'fs';
import urlPathToDir, { dirGenerator, filterMatchingFiles } from './url-path-to-dir';

jest.mock('fs');

describe('url path to dir', () => {
  describe('dir generator', () => {
    it('should return path value and * for single path segment', () => {
      const input = ['a'];
      const output = [...dirGenerator(input)];
      expect(output).toEqual([['a'], ['*']]);
    });

    it('should return dirs in correct order for two path segments', () => {
      const input = ['a', 'b'];
      const output = [...dirGenerator(input)];
      expect(output).toEqual([
        ['a', 'b'],
        ['*', 'b'],
        ['a', '*'],
        ['*', '*'],
      ]);
    });

    it('should return dirs in correct order for three path segments', () => {
      const input = ['a', 'b', 'c'];
      const output = [...dirGenerator(input)];
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

  describe('file filter', () => {
    it('should return only file with correct method without status code', () => {
      const files = ['get.json', 'post.json'];
      const method = 'GET';
      const output = filterMatchingFiles(files, method);
      expect(output).toEqual(['get.json']);
    });

    it('should return files with any status code', () => {
      const files = ['get.json', 'get.200.json', 'get.404.json'];
      const method = 'GET';
      const output = filterMatchingFiles(files, method);
      expect(output).toEqual(['get.json', 'get.200.json', 'get.404.json']);
    });
  });

  describe('url path to dir', () => {
    it('should return undefined for no matching file', () => {
      fs.__setMockFiles({
        '/searchDir/path/post.json': '',
        '/searchDir/other path/get.json': '',
      });

      const randomFn = jest.fn(([firstElement]) => firstElement);
      const output = urlPathToDir('/path', '/searchDir', 'GET', randomFn);
      expect(output).toBeUndefined();
    });

    it('should return the only matching file', () => {
      fs.__setMockFiles({
        '/searchDir/path/get.json': '',
      });

      const randomFn = jest.fn(([firstElement]) => firstElement);
      const output = urlPathToDir('/path', '/searchDir', 'GET', randomFn);
      expect(output).toEqual('/searchDir/path/get.json');
    });

    it('should choose a random file from all matching', () => {
      fs.__setMockFiles({
        '/searchDir/path/get.json': '',
        '/searchDir/path/get.200.json': '',
        '/searchDir/path/get.404.json': '',
      });

      const randomFn = jest.fn(([firstElement]) => firstElement);
      const output = urlPathToDir('/path', '/searchDir', 'GET', randomFn);
      expect(randomFn).toBeCalledWith([
        '/searchDir/path/get.json',
        '/searchDir/path/get.200.json',
        '/searchDir/path/get.404.json',
      ]);
      expect(output).toEqual('/searchDir/path/get.json');
    });
  });
});
