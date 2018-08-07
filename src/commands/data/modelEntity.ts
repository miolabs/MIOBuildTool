import * as fs from "fs-extra";
import * as path from "path";
import { projectConfig } from "../../defaults/projectDefaults";
import { EOL } from "os";
import { consts } from "./consts";

export abstract class ModelEntity {
  constructor(protected entity: any, protected params: any) {}

  public generateBarrel(entities: any) {
    const entityFilenames = entities.map((elem) => elem.$.name);
    const fileContent = this.formatBarrel(entityFilenames) + EOL;
    const modelPath = this.params.targetdir ? this.params.targetdir : projectConfig.datamodelFolder;
    const resultPath = path.join(modelPath, "index.ts");
    const writeSubclass = fs.writeFile(resultPath, fileContent);
    return Promise.all([writeSubclass]);
  }

  public parseEntity() {
    const attrs: {[k in string]: string} = this.entity.$;
    const attributes: any[] = this.entity.attribute;
    const relationships: any[] = this.entity.relationship;

    const filename = `${attrs.name}_ManagedObject.ts`;
    const classname = attrs.representedClassName;
    const currentClassEntityName = classname + "_ManagedObject";
    const parentName = attrs.parentEntity;

    let relationshipNames = [];
    const libDependencies = [];
    if (relationships) {
      relationshipNames = relationships
        .map((rel) => rel.$.destinationEntity)
        .sort()
        .filter((item, pos, ary) => !pos || item !== ary[pos - 1]);
      if (relationships.some((rel) => rel.$.toMany !== "NO")) {
        libDependencies.push(consts.CLASS_TOMANY);
      }
    }

    const fileContent = [
      ...this.openModelEntity(currentClassEntityName, parentName, relationshipNames, libDependencies),
      ...this.parseAttributes(attributes),
      ...this.parseRelationships(relationships),
      ...this.closeModelEntity(),
    ];

    const modelPath = this.params.targetdir ? this.params.targetdir : projectConfig.datamodelFolder;
    const resultPath = path.join(modelPath, filename);

    const writeFiles = [fs.writeFile(resultPath, fileContent.join(EOL))];

    const subclassFilePath = path.join(modelPath, classname + ".ts");
    const writeSubclass = fs
      .pathExists(subclassFilePath)
      .then((exists) => this.createEmptyEntity(exists, classname, currentClassEntityName, subclassFilePath));
    writeFiles.push(writeSubclass);
    return Promise.all(writeFiles);
  }

  protected abstract createEmptyEntity(exists, classname, currentClassEntityName, subclassFilePath);
  protected abstract openModelEntity(
    currentClassEntityName: string, parentName: string,
    relationshipNames: string[], libDependencies: string[]);
  protected abstract closeModelEntity();

  protected abstract formatBarrel(entities): string;

  protected parseAttributes(attributes) {
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

  protected parseRelationships(relationships) {
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
          `    protected _${name}:${consts.CLASS_TOMANY} = null;`,
          // Getter
          `    get ${name}():${consts.CLASS_TOMANY} {`,
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
}
