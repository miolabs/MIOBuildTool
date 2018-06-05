import * as fs from "fs-extra";
import { EOL } from "os";
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
      const generatedFiles: Array <Promise<void[]>> = [];
      for (const entity of entities) {
        generatedFiles.push(generateEntityFile(entity));
      }
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

    const filename = `${attrs.name}_ManagedObject.ts`;
    const classname = attrs.representedClassName;
    const currentClassEntityName = classname + "_ManagedObject";
    const parentName = attrs.parentEntity;

    const fileContent = [
      ...this.openModelEntity(currentClassEntityName, parentName),
      ...this.parseAttributes(attributes),
      ...this.parseRelationships(relationships),
      ...this.closeModelEntity(),
    ];

    const modelPath = projectConfig.datamodelFolder;
    const resultPath = path.join(modelPath, filename);

    const writeFiles = [fs.writeFile(resultPath, fileContent.join(EOL))];

    const subclassFilePath = path.join(modelPath, classname + ".ts");
    const writeSubclass = fs.pathExists(subclassFilePath).then((exists: boolean) => {
      if (!exists) {
        // Create Subclass if it is not yet created
        const content = [
          "",
          "//",
          `// Generated class ${classname}`,
          "//",
          "",
          `/// <reference path="${currentClassEntityName}.ts" />`,
          "",
          `class ${classname} extends ${currentClassEntityName}`,
          "{",
          "",
          "}",
          "",
        ];
        console.log("Create nonexisting subclass: ", subclassFilePath);
        return fs.writeFile(subclassFilePath, content.join(EOL));
      } else {
        return Promise.resolve();
      }
    });
    writeFiles.push(writeSubclass);
    return Promise.all(writeFiles);
  }

  private openModelEntity(cn: string, parentName: string) {
    const parentObject = parentName || "MIOManagedObject";
    const referenceParent = (parentName) ? `${EOL}/// <reference path="${parentName}.ts" />${EOL}` : "";

    const appendableContent = [
      "",
      referenceParent,
      `// Generated class ${cn}`,
      "",
      `class ${cn} extends ${parentObject}`,
      `{`,
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
      const optional = attrs.optional || "YES";
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
      const optional = attrs.optional || "YES";
      const destinationEntity = attrs.destinationEntity;
      const toMany = attrs.toMany || "NO";
      append = append.concat(this.appendRelationship(name, destinationEntity, toMany, optional));
    }
    return append;
  }

  private appendAttribute(name: string, type: string, optional: string, defaultValue?: string) {

    let dv: string;
    let t = ":";

    switch (type) {
      case "Integer":
      case "Float":
      case "Number":
        t += "number";
        break;
      case "String":
      case "Boolean":
        t += type.toLowerCase();
        break;
      case "Array":
      case "Dictionary":
        t = "";
        break;
      default:
        t += type;
      }

    if (!defaultValue) {
        dv = " = null;";
    } else {
        switch (type) {
          case "String":
            dv = ` = '${defaultValue}';`;
            break;
          case "Number":
            dv = ` = ${defaultValue};`;
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
        }
    }

    const appendableContent = [
      "",
      `    // Property: ${name}`,
      // Var
      // `    protected _${name}${t}${dv}`,
      // Setter
      `    set ${name}(value${t}) {`,
      `        this.setValueForKey(value, '${name}');`,
      `    }`,
      // Getter
      `    get ${name}()${t} {`,
      `        return this.valueForKey('${name}');`,
      `    }`,
      // Setter raw value
      `    set ${name}PrimitiveValue(value${t}) {`,
      `        this.setPrimitiveValueForKey(value, '${name}');`,
      `    }`,
      // Getter raw value
      `    get ${name}PrimitiveValue()${t} {`,
      `        return this.primitiveValueForKey('${name}');`,
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
      const appendableContent = [
        ``,
        `    // Relationship: ${name}`,
        // Var
        // `    protected _${name}:${destinationEntity} = null;`,
        // Setter
        `    set ${name}(value:${destinationEntity}) {`,
        `        this.setValueForKey(value, '${name}');`,
        `    }`,
        // Getter
        `    get ${name}():${destinationEntity} {`,
        `        return this.valueForKey('${name}') as ${destinationEntity};`,
        `    }`,
      ];
      return appendableContent;
    } else {
        const cname = name.charAt(0).toUpperCase() + name.slice(1);
        const appendableContent = [
          ``,
          `    // Relationship: ${name}`,
          // Var
          `    protected _${name}:MIOManagedObjectSet = null;`,
          // Getter
          `    get ${name}():MIOManagedObjectSet {`,
          `        return this.valueForKey('${name}');`,
          `    }`,
          // Add
          `    add${cname}Object(value:${destinationEntity}) {`,
          `        this._addObjectForKey(value, '${name}');`,
          `    }`,
          // Remove
          `    remove${cname}Object(value:${destinationEntity}) {`,
          `        this._removeObjectForKey(value, '${name}');`,
          `    }`,
        ];
        return appendableContent;
      }
  }

  private closeModelEntity() {
    return [
      "}",
      "",
    ];
  }
}
