/**
 * This command is responsible for creating new components from templated blueprints.
 */

import * as path from "path";
import { assets } from "../../defaults/assetDefaults";
import { projectConfig } from "../../defaults/projectDefaults";
import { cleanArgs } from "../../utils/arguments";
import { CopyHandler } from "../../utils/copyHandler";
import { generateModels } from "./generateModels";
import { initDataModel } from "./initDataModel";

export function Data(cmd): Promise<boolean> {
    const params = cleanArgs(cmd);
    // TODO: get datamodel folder from project config descriptor file.
    const dataModelFolder = projectConfig.datamodelFolder;
    // TODO: get filename from project config descriptor file.
    const dataModelFile = params.filename ? params.filename : "datamodel.xml";
    const filename = path.join(dataModelFolder, dataModelFile);
    const dataModelCreator = new CopyHandler(assets.datamodel, filename);
    if (params.init) {
      return initDataModel(cmd, dataModelCreator);
      // TODO: save filename to project config descriptor file on successful creation.
    } else {
      return generateModels(cmd, dataModelCreator, params.module);
    }
}
