import { camelToSnake } from "./stringutils";

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
};

export const config = {
    assetsFolder: "templates",
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
