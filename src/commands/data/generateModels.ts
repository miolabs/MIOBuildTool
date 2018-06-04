import * as fs from "fs-extra";
import * as path from "path";
import { promisify } from "util";
import { Parser } from "xml2js";
import { projectConfig } from "../../defaults/projectDefaults";
import { CopyHandler } from "../../utils/copyHandler";
import { ErrorMessage } from "../../utils/error";

export function generateModels(cmd, dataModelFile: CopyHandler) {
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
      const generatedFiles: Array <Promise<void>> = [];
      for (const entity of entities) {
        generatedFiles.push(generateEntityFile(entity));
      }
      console.log(configuration);
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

function generateEntityFile(entity: any) {
  const modelEntity = new ModelEntity(entity);
  return modelEntity.parseEntity();
}

class ModelEntity {

  constructor(private entity: any) {}

  public parseEntity() {
    const attrs: {[k in string]: string} = this.entity.$;
    const attributes: {[k in string]: string} = this.entity.attribute;
    const relationships: {[k in string]: string} = this.entity.relationship;
    const filename = `${attrs.name}ManagedObject.ts`;
    const classname = attrs.representedClassName;
    const fileContent = [
      ...this.openModelEntity(classname),
      ...this.parseAttributes(attributes),
      ...this.parseRelationships(relationships),
      ...this.closeModelEntity(),
    ];
    const modelPath = projectConfig.datamodelFolder;
    const resultPath = path.join(modelPath, filename);
    // Write to disc
    return fs.writeFile(resultPath, fileContent.join("\n"));
  }

  private openModelEntity(classname: string) {
    const cn = classname + "ManagedObject";
    const appendableContent = [
      `// Generated class ${cn}`,
      "",
      `class ${cn} extends MIOManagedObject {`,
    ];
    return appendableContent;
  }

  private parseAttributes(attributes) {
    let append = [];
    if (!attributes) {
      return [];
    }
    for (const item of attributes) {
      const attrs = item.$;
      const name = attrs.name;
      const type = attrs.attributeType;
      const optional = attrs.optional ? attrs.optional : "YES";
      const defaultValue = attrs.defaultValueString;
      append = append.concat(this.appendAttribute(name, type, optional, defaultValue));
    }
    return append;
  }

  private parseRelationships(relationships) {
    let append = [];
    if (!relationships) {
      return [];
    }
    for (const item of relationships) {
      const attrs = item.$;
      const name = attrs.name;
      const optional = attrs.optional ? attrs.optional : "YES";
      const destinationEntity = attrs.destinationEntity;
      const toMany = attrs.toMany ? attrs.toMany : "NO";
      append = append.concat(this.appendRelationship(name, destinationEntity, toMany, optional));
    }
    return append;
  }

  private appendAttribute(name: string, type: string, optional: string, defaultValue?: string) {

    let dv: string;
    let t = ":" + type;

    if (!defaultValue) {
        dv = " = null;";
    } else {
        switch (type) {
          case "String":
            dv = " = '\(defaultValue!)';";
            break;
          case "Number":
            dv = " = \(defaultValue!);";
            break;
          case "Array":
            t = "";
            dv = " = [];";
            break;
          case "Dictionary":
            t = "";
            dv = " = {};";
            break;
          default:
            dv = ";";
            break;
        }
    }

    const appendableContent = [
      "",
      `    // Property: ${name}`,
      // Var
      `    private _${name}${t}${dv}`,
      // Setter
      `    set ${name}(value${t}) {`,
      `        this.setValue('_${name}', value);`,
      `    }`,
      // Getter
      `    get ${name}()${t} {`,
      `        return this.getValue('_${name}');`,
      `    }`,
      // Getter raw value
      `    get ${name}RawValue()${t} {`,
      `        return this._${name};`,
      `    }`,
    ];
    return appendableContent;
  }

  private appendRelationship(
      name: string,
      destinationEntity: string,
      toMany: string,
      optional: string,
    ) {
    if (toMany === "NO") {
        return this.appendAttribute(name, destinationEntity, optional, null);
    } else {
        const cname = name.charAt(0).toUpperCase() + name.slice(1);
        const appendableContent = [
          ``,
          `    // Relationship: ${name}`,
          // Var
          `    private _${name} = [${destinationEntity}];`,
          // Getter
          `    get ${name}():[${destinationEntity}]  {`,
          `        return this.getValue('_${name}');`,
          `    }`,
          // Add
          `    add${cname}Object(value:${destinationEntity}) {`,
          `        this.addObject('_${name}', value);`,
          `    }`,
          // Remove
          `    remove${cname}Object(value:${destinationEntity}) {`,
          `        this.removeObject('_${name}', value);`,
          `    }`,
          // Add objects
          `    add${cname}(value:[${destinationEntity}]) {`,
          `        this.addObjects('_${name}', value);`,
          `    }`,
          // Remove objects
          `    remove${cname}(value:${destinationEntity}) {`,
          `        this.removeObjects('_${name}', value);`,
          `    }`,
        ];
      }
  }

  private closeModelEntity() {
    return [
      "}",
    ];
  }
}
