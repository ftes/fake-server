import fs from 'fs';
import path from 'path';

export function* dirGenerator(pathSegments) {
  if (pathSegments.length === 0) {
    yield* [[]];
    return;
  }

  const [firstPathSegment, ...otherPathSegments] = pathSegments;
  const otherPathSegmentsGenerator = dirGenerator(otherPathSegments);
  let otherDirSegmentsResult;

  // eslint-disable-next-line no-cond-assign
  while (!(otherDirSegmentsResult = otherPathSegmentsGenerator.next()).done) {
    const otherDirSegments = otherDirSegmentsResult.value;
    yield [firstPathSegment, ...otherDirSegments];
    yield ['*', ...otherDirSegments];
  }
}

export const filterMatchingFiles = (files, httpMethod) =>
  files.filter(file => file.toLowerCase().startsWith(`${httpMethod.toLowerCase()}.`));

const randomArrayElement = array => array[Math.floor(Math.random() * array.length)];

const urlPathToFile = (
  urlPath, searchDir, httpMethod,
  randomFunction = randomArrayElement,
) => [...dirGenerator(urlPath.split('/').filter(s => s !== ''))]
  .map((dirSuffixSegments) => {
    const dirSuffix = dirSuffixSegments.join('/');
    const dir = path.join(searchDir, dirSuffix);
    const filesInDir = fs.readdirSync(dir);
    const matchingFilesInDir = filterMatchingFiles(filesInDir, httpMethod);
    const matchingFiles = matchingFilesInDir.map(file => path.join(dir, file));
    return randomFunction(matchingFiles);
  })
  .find(file => !!file);

export default urlPathToFile;
