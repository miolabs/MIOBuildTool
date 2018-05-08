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

import { assets } from "../../utils/ProjectHandler";
import { FolderHandler } from "./FolderHandler";
import * as fs from "fs-extra";

export function Init(name: string, args: any) {
    const folder = new FolderHandler(assets.initDefault, name);
    return folder
      .checkExistence()
      .then((pathExists: boolean) => {
        if (pathExists) {
            if (args.force) {
                return fs
                    .remove(folder.resultFolderName)
                    .then(() => folder.build());
            } else {
                throw new Error(`Folder already exists in the selected path: ${folder.resultFolderName}.`);
            }
        } else {
            return folder.build();
        }
      })
      .then(() => {
        console.log(`Project initialized in ${folder.resultFolderName}`);
        return true;
      })
      .catch((err) => {
        console.error(err);
        return false;
    });
}
