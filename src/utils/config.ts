"use strict";

/**
 * Get the config files based on https://github.com/3rd-Eden/find-package-json. MIT.
 */

import * as fs from "fs-extra";
import * as path from "path";
import { projectConfig } from "../defaults/projectDefaults";

/**
 * Find project config file. Singleton. Blocking recursive search.
 * @api public
 */
export function getConfig(fileName?: string): any {
    let currentDir = process.cwd();
    const configFileName = fileName || projectConfig.configFileName;
    const config = {};

    /**
     * Return the parsed project config that we find in a parent folder.
     *
     * @returns config value plus __filepath attribute for the config file location.
     * @api private
     */
    function next(): any {
        if (currentDir.match(/^(\w:\\|\/)$/)) {
            config[configFileName] = {};
            return {}; // return empty object if it can not find the config file.
        }
        const filePath = path.join(currentDir, configFileName);
        if (fs.existsSync(filePath)) {
            const data = parse(fs.readFileSync(filePath));
            data.__path = filePath;
            data.__base = path.basename(filePath);
            config[configFileName] = data;
            return config[configFileName];
        } else {
            currentDir = path.resolve(currentDir, "..");
            return next();
        }
    }

    /**
     * Attempt to somewhat safely parse the JSON.
     *
     * @param data JSON blob that needs to be parsed.
     * @returns Parsed JSON or empty object.
     * @api private
     */
    function parse(data: any): any {
        data = data.toString("utf-8");

        if (data.charCodeAt(0) === 0xFEFF) {
            /* Remove a possible UTF-8 BOM (byte order marker) as
            this can lead to parse values when passed in to the JSON.parse. */
            data = data.slice(1);
        }

        try {
            return JSON.parse(data);
        } catch (e) {
            console.error("Config JSON file found, but it can not be parsed. Continue with empty config.");
            config[configFileName] = {};
            return {};
        }
    }

    return (config[configFileName]) ? config[configFileName] : next();
}
