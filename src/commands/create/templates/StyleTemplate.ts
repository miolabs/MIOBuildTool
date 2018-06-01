import * as path from "path";
import { projectConfig } from "../../../defaults/projectDefaults";
import { IAssetData } from "../../../interfaces/IAssetData";
import { ITemplateData } from "../../../interfaces/ITemplateData";
import { ProjectHandler } from "../../../utils/project";
import { capitalizeFirstLetter } from "../../../utils/stringutils";

export function genStyleName(name: string) {
    name += name.slice(-4) === "View" ? "" : "View";
    name = capitalizeFirstLetter(name);
    return name;
}

export function genStyleFileName(name: string, extension: string= "css") {
    if (extension === "css") {
        return `${genStyleName(name)}.css`;
    } else if (extension === "scss") {
        return `_${genStyleFileName}.scss`;
    } else {
        console.error("%s extension is not supported", extension);
    }
}

export function genStyleFilePath(name: string) {
    return path.join(projectConfig.cssDir, name);
}

export class StyleTemplate {
    public assetData: IAssetData = null;
    public fileName = "";
    public filePath = "";
    public resultFileFullPath = "";
    public data: any = {};

    constructor(name: string, assetData: IAssetData) {
        this.assetData = assetData;

        this.fileName = genStyleFileName(name);
        this.filePath = genStyleFilePath(name);
        this.resultFileFullPath = path.join(this.filePath, this.fileName);

        if (assetData.variableNames.indexOf("containerId") > -1) {
            this.data.containerId = ProjectHandler.genContainerIdFromName(name);
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
