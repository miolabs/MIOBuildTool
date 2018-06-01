/**
 * This command is responsible for creating new components from templated blueprints.
 */

import { assets } from "../../defaults/assetDefaults";
import { cleanArgs } from "../../utils/arguments";
import { CopyHandler } from "../../utils/copyHandler";
import { generateModels } from "./generateModels";
import { initDataModel } from "./initDataModel";

export function Data(cmd): Promise<boolean> {
    const params = cleanArgs(cmd);
    const filename = params.filename ? params.filename : "datamodel.xml";
    const dataModelFile = new CopyHandler(assets.datamodel, filename);
    if (params.init) {
      // TODO: save filename to project config descriptor file.
      return initDataModel(cmd, dataModelFile);
    } else {
      // TODO: get filename from project config descriptor file. rather than parameter.
      return generateModels(cmd, dataModelFile);
    }
}
