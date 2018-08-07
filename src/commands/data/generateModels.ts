import * as fs from "fs-extra";
import { promisify } from "util";
import { Parser } from "xml2js";
import { CopyHandler } from "../../utils/copyHandler";
import { ErrorMessage } from "../../utils/error";
import { modelEntityFactory } from "./modelEntityFactory";

export function generateModels(cmd, dataModelFile: CopyHandler, params: any) {
  return dataModelFile.checkExistence()
    .then((pathExists: boolean) => {
      if (pathExists) {
        return parseDataModel(dataModelFile.resultName);
      } else {
        ErrorMessage(cmd, `Datamodel file does not exists in path ${dataModelFile.resultName}`);
      }
    })
    .then((xmlData: any) => {
      const entities = xmlData.model.entity;
      const configuration = xmlData.model.entity;
      const generatedFiles: Array <Promise<void[]>> = [];
      for (const entity of entities) {
        generatedFiles.push(generateEntityFile(entity, params));
      }
      generatedFiles.push(generateBarrelFile(entities, params));
      return Promise.all(generatedFiles);
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
function parseDataModel(filePath): Promise<string> {
    const parser = new Parser();
    const asyncParser = promisify<Buffer, string>(parser.parseString);
    return fs.readFile(filePath)
        .then((data) => asyncParser(data))
        .catch((err) => {
            console.error(err);
            return "";
        });
}

function generateEntityFile(entity: any, params: boolean) {
  // TODO: connect differentiation
  const modelEntity = modelEntityFactory(entity, params);
  return modelEntity.parseEntity();
}

function generateBarrelFile(entities, params: boolean) {
  const modelEntity = modelEntityFactory({}, params);
  return modelEntity.generateBarrel(entities);
}
