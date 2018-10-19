# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## UNRELEASED - date

## [1.3.0] - 2018-10-19
### Changed
- Use pre-built js files in docker image (not `neutrino start`)

### Added
- Explicitly expose /usr/src/app/config volume in Dockerfile
- Gzip compression

## [1.2.2] - 2018-10-19
### Fixed
- Skip proxy middleware if `res.body` is already present

## [1.2.1] - 2018-08-23
### Fixed
- Do not fail if no pre-configuration script is available (it should be optional)

## [1.2.0] - 2018-08-03
### Added
- Dockerize
- Allow pre-configuration script, that is invoked before any other middleware is registered on the express instance

## [1.1.0] - 2018-04-13
### Added
- Specify HTTP response status code in filename: e.g. `get.404.json` leads to a `HTTP 404`.
- Choose a random response file if several match in the same folder (e.g. both `get.404.json` and `get.200.json` are present).
- JSDoc in `configuration.js` so that the file is self-contained after copying it.

### Changed
- URL to file mapping: order in which path segments are replaced with wildcards changed (see [./src/utils/url-path-to-file.test.js](`url-path-to-file.test.js`)).
- Handle missing and non-object `res.body` in echo params middleware.

## [1.0.4] - 2018-03-28
### Added
- `bodyParser` dependency for deserializing form-encoded request body
- `echo` endpoint as an example in configuration

### Changed
- documentation improved

## [1.0.3] - 2018-03-14
### Added
- `touchMissing` option for `file` middleware

## [1.0.2] - 2018-03-09
### Changed
- Make `configDir` option mandatory (important for global installation)

## [1.0.1] - 2018-03-09
### Changed
- Meta data in `package.json`

## [1.0.0] - 2018-03-09
### Added
- Initial commit
