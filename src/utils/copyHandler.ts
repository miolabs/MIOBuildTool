import * as fs from "fs-extra";
import * as path from "path";
import { IAssetData } from "../interfaces/IAssetData";
import { getAsset } from "./project";

/**
 * Build the result relative the directory that the program has been called.
 *
 * @param targetPath Path relative to the current directory of the command line utility installation folder.
 */
function getTarget(targetPath: string) {
    return path.resolve(".", targetPath);
}
export class CopyHandler {
    /**
     * Path for the template directory in this project.
     */
    private templatePath = "";

    constructor(
        assetData: IAssetData,
        public resultName: string,
    ) {
        this.templatePath = getAsset(assetData.path);
        this.resultName = getTarget(resultName);
    }
    /**
     * Check if the path exists that is about to be created.
     *
     * @returns Promise<boolean> true if it already exists.
     */
    public checkExistence(): Promise<boolean> {
        return fs.pathExists(this.resultName);
    }
    /**
     * Copies the proper assets to the defined place
     *
     * @returns Promise<void>
     */
    public build(): Promise<void> {
        return fs.copy(this.templatePath, this.resultName);
    }
}
