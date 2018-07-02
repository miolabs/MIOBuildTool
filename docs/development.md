# Development

## Getting started

Install the dependencies of the project, and start development.

```bash
npm install
npm start
```

## Make it available in terminal

You can link your repository as if it was installed globally, with [npm-link](https://docs.npmjs.com/cli/link)

```bash
npm link
# test it with:
miojs new -h
```

## How to debug

Set the environmental arguments in `.vscode/launch.json` and start the launch config.

## Write unit tests

[tutorial](http://how-to-write-a-typescript-library.com/unit-testing)

## Publish to npm

To publish your first version to npm run:

```bash
npm run prod
# update changelog
npm version major|minor|patch
npm publish
```

```bash
npm install miojs -g
```