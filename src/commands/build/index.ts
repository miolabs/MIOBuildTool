/**
 * This command is responisble for building the project, transpiling the code and put everything to the right place.
 */

import * as fs from "fs-extra";
import * as path from "path";
import * as childProcess from "promisify-child-process";
import { projectConfig } from "../../defaults/projectDefaults";
import { getConfig } from "../../utils/config";
import { printLog } from "../../utils/printLog";

export function Build(args: any) {
    // TODO: find swift files
    // TODO: check which files have changed since the last build, and mark them as need-compile
    // TODO: compile swift files to ts
    childProcess.exec("tsc")
      .then((output) => {
        console.debug("Typescript compilation complete");
        printLog(output.stdout);
        printLog(output.stderr);
        // Typescript config file, to get the proper paths, defaults source to "resources"
        const tsconfig = getConfig(projectConfig.tsconfig);
        const targetDir = (tsconfig.compilerOptions && tsconfig.compilerOptions.outDir) ?
          tsconfig.compilerOptions.outDir :
          "resources";
        // Assets to copy
        const distFolder = path.join(".", projectConfig.distFolder);
        // currently it assumes that the resource folder and the typescript generation folder are the same.
        const resources = path.join(".", targetDir);
        const libsSource = path.join("node_modules", "miojslibs", "dist", "js"); // miojslibs from npm
        const libsTarget = path.join(distFolder, "libs", "miojslibs");
        return Promise.all([
          fs.copySync(resources, distFolder, { filter: (src, dest) => {
            // files will be copied if this function returns true to them. implement custom filter here.
            return true;
          } }),
          fs.pathExists(libsSource).then((valid) => valid ? fs.copySync(libsSource, libsTarget) : null),
        ]);
      }).then((copyResult) => {
        console.debug("Copy assets finished");
      }).catch((err) => {
        console.error(err);
      });

    return true;
}
