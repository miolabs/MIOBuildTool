
import * as path from "path";
import { projectConfig } from "../../../defaults/projectDefaults";
import { IAssetData } from "../../../interfaces/IAssetData";
import { ITemplateData } from "../../../interfaces/ITemplateData";
import { camelToSnake, capitalizeFirstLetter, uncapitalizeFirstLetter } from "../../../utils/stringutils";
import { ViewTemplate } from "./ViewTemplate";

export function genContainerIdFromName(name: string) {
    return camelToSnake(name).toLowerCase();
}
export function genControllerFilePath(name: string) {
    return path.join(projectConfig.tsDir, name);
}
export function genControllerName(name: string) {
    name += name.slice(-14) === "ViewController" ? "" : "ViewController";
    name = capitalizeFirstLetter(name);
    return name;
}
export function genControllerFileName(name: string) {
    return `${genControllerName(name)}.ts`;
}
export function genVCvarName(name: string) {
    return uncapitalizeFirstLetter(name);
}

export class ControllerTemplate {
    public assetData: IAssetData = null;
    public fileName = "";
    public filePath = "";
    public resultFileFullPath = "";
    public data: any = {};

    constructor(name: string, assetData: IAssetData, view?: ViewTemplate) {
        this.assetData = assetData;

        this.fileName = genControllerFileName(name);
        this.filePath = genControllerFilePath(name);
        this.resultFileFullPath = path.join(this.filePath, this.fileName);

        if (assetData.variableNames.indexOf("name") > -1) {
            this.data.name = genControllerName(name);
        }
        if (assetData.variableNames.indexOf("vcName") > -1 ) {
            this.data.vcName = genVCvarName(genControllerName(name));
        }
        if (view && assetData.variableNames.indexOf("viewPath") > -1) {
            this.data.viewPath = view.filePath;
        }
        if (view && assetData.variableNames.indexOf("containerId") > -1) {
            if (view.data.containerId) {
                this.data.viewPath = view.data.containerId;
            } else {
                console.error("ContainerID is mising from template!");
            }
        }
    }

    public getBuildInfo(customData?: any): ITemplateData {
        return {
            assetData: this.assetData,
            dataToFill: Object.assign({}, this.data, customData),
            resultFileFullPath: this.resultFileFullPath,
        };
    }
}
