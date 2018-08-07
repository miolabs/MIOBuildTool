# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.6] - 2018-07-04

### Added

* New parameter to change the target directory.

### Fixed

* Source filename parameter name did not work, changed its name also to sourcepath.

## [1.1.5] - 2018-07-04

### Added

* Add barrel export for all generated models.
* Add relationship imports for module generation.
* Add other imports from miojslibs-core

## [1.1.4] - 2018-07-02

### Added

* Generate modelEntities for ES6 imports.

### Changed

* Make the initial template (templates/init) platform independent

## [1.1.3] - 2018-06-07

### Fixed

* Make sure the folder exists before copy into it in the template.

## [1.1.2] - 2018-06-07

### Fixed

* Typo in template readme

## [1.1.1] - 2018-06-07

### Added

* Changelog section into README

### Changed

* Default template

### Fixed

* Changelog diff url

## [1.1.0] - 2018-06-05

### Added

* Datamodel generation
* Default build task for VSCode

## [1.0.5] - 2018-05-30

### Added

* Wireframe for all planned commands
* Documentation
* Code redesign
* Publish to the previously created npm repository,
  continue with that version numbering.

## 0.0.1 - 2018-03-30

### Added

* Basic functionality that worked before rewriting
* Changelog
* Prod build
* Mioconfig file search.
* Build command

[Unreleased]: https://github.com/miolabs/MIOBuildTool/compare/v1.1.6...HEAD
[1.1.6]:  https://github.com/miolabs/MIOBuildTool/compare/v1.1.5...v1.1.6
[1.1.5]:  https://github.com/miolabs/MIOBuildTool/compare/v1.1.4...v1.1.5
[1.1.4]:  https://github.com/miolabs/MIOBuildTool/compare/v1.1.3...v1.1.4
[1.1.3]:  https://github.com/miolabs/MIOBuildTool/compare/v1.1.2...v1.1.3
[1.1.2]:  https://github.com/miolabs/MIOBuildTool/compare/v1.1.1...v1.1.2
[1.1.1]:  https://github.com/miolabs/MIOBuildTool/compare/v1.1.0...v1.1.1
[1.1.0]:  https://github.com/miolabs/MIOBuildTool/compare/v1.0.5...v1.1.0
[1.0.5]:  https://github.com/miolabs/MIOBuildTool/compare/v0.0.1...v1.0.5