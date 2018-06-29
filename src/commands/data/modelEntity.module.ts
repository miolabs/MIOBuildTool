
import { EOL } from "os";
import { ModelEntity } from "./modelEntity";
import * as fs from "fs-extra";
import { projectConfig } from "../../defaults/projectDefaults";

export class ModelEntityModule extends ModelEntity {

  constructor(entity: any) {
    super(entity);
  }

  protected createEmptyEntity(exists, classname, currentClassEntityName, subclassFilePath) {
    if (!exists) {
      // Create Subclass if it is not yet created
      const content = [
        "//",
        `// Generated class ${classname}`,
        "//",
        "",
        `import { ${currentClassEntityName} } from "./${currentClassEntityName}";`,
        "",
        `export class ${classname} extends ${currentClassEntityName} {`,
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

  protected openModelEntity(cn: string, parentName: string) {
    const parentObject = parentName || "MIOManagedObject";
    let referenceParent = "";
    if (parentName) {
      referenceParent = `import { ${parentName} } from "./${parentName}";`;
    } else {
      referenceParent = `import { MIOManagedObject } from "${projectConfig.libsName}";`;
    }

    const appendableContent = [
      referenceParent,
      "",
      `// Generated class ${cn}`,
      "",
      `export class ${cn} extends ${parentObject} {`,
    ];
    return appendableContent;
  }

  protected closeModelEntity() {
    return [
      "}",
      "",
    ];
  }
}
