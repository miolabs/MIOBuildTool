import * as fs from "fs-extra";
import Handlebars from "handlebars";
import * as path from "path";
import { ITemplateData } from "../../interfaces/ITemplateData";
import { getAsset } from "../../utils/ProjectHandler";

export class TemplateHandler {
    constructor(
        public data: ITemplateData,
    ) {}

    public build(): Promise<boolean> {
        return fs.readFile(getAsset(this.data.assetData.path), "utf-8")
            .then((source: string) => {
                const template = Handlebars.compile(source);
                const processed = template(this.data.dataToFill);
                return this.saveFile(processed, this.data.resultFileFullPath);
            })
            .catch((error) => {
                console.error(error);
                return false;
            });
    }

    private saveFile(processed, writePath: string): Promise<boolean> {
        return fs.outputFile(writePath, processed)
          .then(() => {
            console.info(`File saved in ${writePath}`);
            return true;
          })
          .catch((error) => {
            console.error(error);
            return false;
        });
    }
}
