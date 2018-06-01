import { assets } from "../../defaults/assetDefaults";
import { TemplateHandler } from "../../utils/templateHandler";
import { ControllerTemplate } from "./templates/ControllerTemplate";
import { StyleTemplate } from "./templates/StyleTemplate";
import { ViewTemplate } from "./templates/ViewTemplate";

export function component(
    params, name: string, needController: boolean= false, needView: boolean= false) {
    const needStyle = !params.noStyle;
    const promises = [];
    let style = null;
    let view = null;

    if (needStyle) {
        const asset = params.css ? assets.viewScssDefault : assets.viewCssDefault;
        style = new StyleTemplate(name, asset);
        const css = new TemplateHandler(style.getBuildInfo());
        promises.push(css.build());
    }

    if (needView) {
        const asset = params.noCustomStyle ? assets.viewHtmlNoCustomStyle : assets.viewHtmlDefault;
        view = new ViewTemplate(name, asset, style);
        const html = new TemplateHandler(view.getBuildInfo());
        promises.push(html.build());
    }

    if (needController) {
        let asset = null;
        if (!needView && params.initEmptyResource) {
            asset = assets.compVCEmptyRes;
        } else if (!needView && params.initEmpty) {
            asset = assets.compVCEmpty;
        } else {
            asset = assets.compVcDefault;
        }
        const ts = new ControllerTemplate(name, asset, view);
        const ctrl = new TemplateHandler(ts.getBuildInfo());
        promises.push(ctrl.build());
    }
    return Promise.all(promises)
        .then((result: any[]) => {
            return true;
        })
        .catch((error) => false);
}
