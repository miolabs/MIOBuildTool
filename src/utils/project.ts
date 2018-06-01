import * as path from "path";
import { assets } from "../defaults/assetDefaults";
import { camelToSnake } from "./stringutils";

/**
 * Get the asset from the assets directory.
 *
 * @param assetPath Asset relative to the assets directory.
 */
export function getAsset(assetPath: string) {
    return path.resolve(__dirname, "..", assets.assetsFolder.path, assetPath);
}

export class ProjectHandler {
    public static genContainerIdFromName(name: string) {
        return camelToSnake(name).toLowerCase();
    }
}
