
import { EOL } from "os";
import { ModelEntity } from "./modelEntity";
import * as fs from "fs-extra";
import { projectConfig } from "../../defaults/projectDefaults";

export class ModelEntityModule extends ModelEntity {

  constructor(entity: any, params: any) {
    super(entity, params);
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

  protected openModelEntity(cn: string, parentName: string, relationshipNames: string[], libDependencies: string[]) {
    const parentObject = parentName || "MIOManagedObject";
    let referenceParent = "";
    if (parentName) {
      referenceParent = `import { ${parentName} } from "./${parentName}";`;
    } else {
      referenceParent = `import { MIOManagedObject } from "${projectConfig.libsName}";`;
    }

    const importRelationships = relationshipNames.map((name) => `import { ${name} } from "./${name}";`);
    const importFromLib = libDependencies.map((name) => `import { ${name} } from "miojslibs-core";`);

    const appendableContent = [
      ...importFromLib,
      referenceParent,
      ...importRelationships,
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

  protected formatBarrel(entityFileNames) {
    return entityFileNames.map((name) => `export * from "./${name}";`).join(EOL);
  }
}
