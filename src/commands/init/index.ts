/**
 * This command is responsible for initializing a new project.
 *
 * Usage: init <app-name>
 *
 * It won't create the project if a folder exists in the given path with that name.
 *
 * The project name can contain folder separator,
 * but it will see it as a folder structure and create the folder structure accordingly.
 */

import * as fs from "fs-extra";
import { assets } from "../../defaults/assetDefaults";
import { CopyHandler } from "../../utils/copyHandler";

export function Init(name: string, args: any) {
    const folder = new CopyHandler(assets.initDefault, name);
    return folder
      .checkExistence()
      .then((pathExists: boolean) => {
        if (pathExists) {
            if (args.force) {
                return fs
                    .remove(folder.resultName)
                    .then(() => folder.build());
            } else {
                throw new Error(`Folder already exists in the selected path: ${folder.resultName}.`);
            }
        } else {
            return folder.build();
        }
      })
      .then(() => {
        console.log(`Project initialized in ${folder.resultName}`);
        return true;
      })
      .catch((err) => {
        console.error(err);
        return false;
    });
}
