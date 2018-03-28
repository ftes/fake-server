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

export default function urlPathToDir(urlPath, searchDir) {
  return null;
}
