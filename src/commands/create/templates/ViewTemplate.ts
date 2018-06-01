import * as path from "path";
import { projectConfig } from "../../../defaults/projectDefaults";
import { IAssetData } from "../../../interfaces/IAssetData";
import { ITemplateData } from "../../../interfaces/ITemplateData";
import { ProjectHandler } from "../../../utils/project";
import { capitalizeFirstLetter } from "../../../utils/stringutils";
import { StyleTemplate } from "./StyleTemplate";

export function genHTMLFilePath(name: string) {
    return path.join(projectConfig.htmlDir, name);
}
export function genViewName(name: string) {
    name += name.slice(-4) === "View" ? "" : "View";
    name = capitalizeFirstLetter(name);
    return name;
}
export function genHTMLFileName(name: string) {
    return `${genViewName(name)}.html`;
}

export class ViewTemplate {
    public assetData: IAssetData = null;
    public fileName = "";
    public filePath = "";
    public resultFileFullPath = "";
    public data: any = {};

    constructor(name: string, assetData: IAssetData, style?: StyleTemplate) {
        this.assetData = assetData;

        this.fileName = genHTMLFileName(name);
        this.filePath = genHTMLFilePath(name);
        this.resultFileFullPath = path.join(this.filePath, this.fileName);

        if (assetData.variableNames.indexOf("containerId") > -1) {
            if (style && style.data && style.data.containerId) {
                this.data.containerId = style.data.containerId;
            } else {
                this.data.containerId = ProjectHandler.genContainerIdFromName(name);
            }
        }
        if (style && assetData.variableNames.indexOf("customStyleFile") > -1 ) {
            this.data.customStyleFile = style.fileName;
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
