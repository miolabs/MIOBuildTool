# Commands

> here you can read the planned functionality,
> for the actual implementation info, follow the link to the detailed command docs.

* [init] - create a new project from a template
  * the templates are located in the repository.
* [create] - create a file from blueprint
  * separate ts files
* [build] - build the project
  * make the project runnable.
  * scss transpilation for web projects
  * --watch option for incremental builds.
* [pack] - create a deployable version
  * pack the files, add version somehow.
* [test] - run the tests
  * currently there are no ways for testing.
* [serve] - start an http server with the files.
  * currently we use a minimal express server.
* [lint] - lint the code.
  * currently we use `htmlhint` and `tslint`
  * generate the lint configs
* [dev]
  * combine the others

[init]: commands/init.md
[create]: commands/create.md
[build]: commands/build.md
[pack]: commands/pack.md
[test]: commands/test.md
[serve]: commands/serve.md
[lint]: commands/lint.md
[dev]: commands/dev.md