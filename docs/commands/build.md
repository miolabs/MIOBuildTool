# Build

## build

Build the project.

## Parameters

None

## Under the hood

1. Runs `tsc` to compile the project with its `tsconfig.json`
1. Copies the `resources` folder contents to `app` folder.
1. Copies the `miojslibs` libs js files to `app/libs/miojslibs` folder,
   if it is available.

<!-- ## Planned features

* scss transpilation for web projects
* --watch option for incremental builds. -->