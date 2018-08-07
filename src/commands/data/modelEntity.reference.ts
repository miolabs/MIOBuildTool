
import { EOL } from "os";
import { ModelEntity } from "./modelEntity";
import * as fs from "fs-extra";

export class ModelEntityReference extends ModelEntity {

  constructor(entity: any, params: any) {
    super(entity, params);
  }

  protected createEmptyEntity(exists, classname, currentClassEntityName, subclassFilePath) {
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
  }

  protected openModelEntity(cn: string, parentName: string, relationshipNames: string[], libdependencies: string[]) {
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

  protected closeModelEntity() {
    return [
      "}",
      "",
    ];
  }

  protected formatBarrel(entityFileNames) {
    return entityFileNames.map((name) => `/// <reference path="${name}.ts" />`).join(EOL);
  }
}
