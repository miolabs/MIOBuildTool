import * as fs from "fs-extra";
import * as path from "path";
import { IAssetData } from "../../interfaces/IAssetData";
import { getAsset } from "../../utils/ProjectHandler";

/**
 * Build the result relative the directory that the program has been called.
 *
 * @param targetPath Path relative to the curret directory.
 */
function getTarget(targetPath: string) {
    return path.resolve(".", targetPath);
}
export class FolderHandler {
    /**
     * Path for the template directory in this project.
     */
    private templateFolderPath = "";

    constructor(
        assetData: IAssetData,
        public resultFolderName: string,
    ) {
        this.templateFolderPath = getAsset(assetData.path);
        this.resultFolderName = getTarget(resultFolderName);
    }
    /**
     * Check if the folder exists that is about to be created.
     *
     * @returns Promise<boolean> true if it already exists.
     */
    public checkExistence(): Promise<boolean> {
        return fs.pathExists(this.resultFolderName);
    }
    /**
     * Copies the proper assets to the defined place
     *
     * @returns Promise<void>
     */
    public build(): Promise<void> {
        return fs.copy(this.templateFolderPath, this.resultFolderName);
    }
}
