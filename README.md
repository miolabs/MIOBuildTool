# miojs-cli

This is a cli tool to generate projects for [MIOJSLibs](https://github.com/miolabs/MIOJSLibs)

* [Usage](#usage)
* [Commands](#commands)
* [Development](#development)
* [Plans](#plans)

## Usage

```bash
npm install miojs -g
miojs -h
```

## Commands

* init - create a new project from a template
  * the templates are located in the repository.
* create - create a file from blueprint
  * separate ts files
* build - build the project
  * make the project runnable.
  * scss transpilation for web projects
  * --watch option for incremental builds.
* pack - create a deployable version
  * pack the files, add version somehow.
* test - run the tests
  * currently there are no ways for testing.
* serve - start an http server with the files.
  * currently we use a minimal express server.
* lint - lint the code.
  * currently we use `htmlhint` and `tslint`
  * generate the lint configs
* dev
  * combine the others

## Development

[Development docs](./docs/development.md)

## Plans

[Plan docs](./docs/plan.md)