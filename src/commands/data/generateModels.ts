import * as fs from "fs-extra";
import { Parser } from "xml2js";
import { CopyHandler } from "../../utils/copyHandler";
import { ErrorMessage } from "../../utils/error";

export function generateModels(cmd, dataModelFile: CopyHandler) {
    return dataModelFile.checkExistence()
      .then((pathExists: boolean) => {
        if (pathExists) {
                return parseDataModel(dataModelFile.resultName)
                    .then((parsedData) => {
                        return true; // generateFiles(parsedData);
                    });
        } else {
            ErrorMessage(cmd, `Datamodel file does not exists in path ${dataModelFile.resultName}`);
        }
      })
      .then(() => {
        console.log(`Model files generated.`);
        return true;
      })
      .catch((err) => {
        console.error(err);
        return false;
      });
}
/**
 * Parse datamodel XML to get the appropriate values for datamodel template generation.
 *
 * @param filePath path to the datamodel xml file.
 */
function parseDataModel(filePath) {
    const parser = new Parser();
    return fs.readFile(filePath)
        .then((data) => {
            parser.parseString(data, (err, result) => {
                console.dir(result);
            });
        })
        .catch((err) => {
            console.error(err);
            return false;
        });
}
