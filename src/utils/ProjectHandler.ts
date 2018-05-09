import { camelToSnake } from "./stringutils";
import * as path from "path";

/**
 * These assets refer to the files that are necessary for the tool to work in this repository.
 */
export const assets = {
    compVcDefault: {
        path: "components/controller/vc.default.hbs",
        variableNames: ["name", "vcName", "containerId", "viewPath"]},
    compVCEmpty: {path: "components/controller/vc.empty.hbs", variableNames: ["name"]},
    compVCEmptyRes: {path: "components/controller/vc.emptyres.hbs", variableNames: ["name", "vcName", "containerId"]},
    initDefault: {path: "init/default", variableNames: []},
    viewCssDefault: {path: "components/view/css.default.hbs", variableNames: ["containerId"]},
    viewHtmlDefault: {path: "components/view/html.default.hbs", variableNames: ["containerId", "customStyleFile"]},
    viewHtmlNoCustomStyle: {path: "components/view/html.nocustomstyle.hbs", variableNames: ["containerId"]},
    viewScssDefault: {path: "components/view/scss.default.hbs", variableNames: ["containerId"]},
    assetsFolder: "templates",
};

/**
 * Get the asset from the assets directory.
 *
 * @param assetPath Asset relative to the assets directory.
 */
export function getAsset(assetPath: string) {
    return path.resolve(__dirname, "..", assets.assetsFolder, assetPath);
}

/**
 * These config files refer to the defaults for project-related data.
 */
export const config = {
    cssDir: "app/layout",
    htmlDir: "app/layout",
    tsDir: "sources",
    configFileName: "mioconfig.json",
};

export class ProjectHandler {
    public static genContainerIdFromName(name: string) {
        return camelToSnake(name).toLowerCase();
    }
}
