import * as path from "path";
import { camelToSnake } from "./stringutils";
import { IAssetData } from "../interfaces/IAssetData";

/**
 * These assets refer to the files that are necessary for the tool to work in this repository.
 */
export const assets: {[k in string]: IAssetData} = {
    compVcDefault: {
        path: "components/controller/vc.default.hbs",
        variableNames: ["name", "vcName", "containerId", "viewPath"],
    },
    compVCEmpty: {
        path: "components/controller/vc.empty.hbs",
        variableNames: ["name"],
    },
    compVCEmptyRes: {
        path: "components/controller/vc.emptyres.hbs",
        variableNames: ["name", "vcName", "containerId"],
    },
    datamodel: {
        path: "data/datamodel.xml",
        variableNames: [],
    },
    initDefault: {
        path: "init/default",
        variableNames: [],
    },
    viewCssDefault: {
        path: "components/view/css.default.hbs",
        variableNames: ["containerId"],
    },
    viewHtmlDefault: {
        path: "components/view/html.default.hbs",
        variableNames: ["containerId", "customStyleFile"],
    },
    viewHtmlNoCustomStyle: {
        path: "components/view/html.nocustomstyle.hbs",
        variableNames: ["containerId"],
    },
    viewScssDefault: {
        path: "components/view/scss.default.hbs",
        variableNames: ["containerId"],
    },
    assetsFolder: {
        path: "templates",
        variableNames: [],
    },
};

/**
 * Get the asset from the assets directory.
 *
 * @param assetPath Asset relative to the assets directory.
 */
export function getAsset(assetPath: string) {
    return path.resolve(__dirname, "..", assets.assetsFolder.path, assetPath);
}

/**
 * These config files refer to the defaults for project-related data.
 */
export const projectConfig = {
    cssDir: "app/layout",
    htmlDir: "app/layout",
    tsDir: "sources",
    configFileName: "mioconfig.json",
    tsconfig: "tsconfig.json",
    distFolder: "app",
    datamodelFolder: "model/",
};

export class ProjectHandler {
    public static genContainerIdFromName(name: string) {
        return camelToSnake(name).toLowerCase();
    }
}
