import { CopyHandler } from "../../utils/copyHandler";
import { ErrorMessage } from "../../utils/error";

export function initDataModel(cmd, dataModelFile: CopyHandler) {
    return dataModelFile.checkExistence()
      .then((pathExists: boolean) => {
        if (pathExists) {
                ErrorMessage(cmd, `Path already exists in the selected path: ${dataModelFile.resultName}.`);
        } else {
            return dataModelFile.build();
        }
      })
      .then(() => {
        console.log(`Datamodel is initialized in ${dataModelFile.resultName}`);
        return true;
      })
      .catch((err) => {
        console.error(err);
        return false;
      });
}
