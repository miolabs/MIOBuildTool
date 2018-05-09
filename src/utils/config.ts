"use strict";

/**
 * Get the config files based on https://github.com/3rd-Eden/find-package-json. MIT.
 */

import * as path from "path";
import * as fs from "fs-extra";
import { config as projectConfig } from "./ProjectHandler";

/**
 * Find project config file. Singleton. Blocking recursive search.
 * @api public
 */
export function getConfig(): any {
    let currentDir = process.cwd();
    let config = null;

    /**
     * Return the parsed project config that we find in a parent folder.
     *
     * @returns config value plus __filepath attribute for the config file location.
     * @api private
     */
    function next(): any {
        if (currentDir.match(/^(\w:\\|\/)$/)) {
            config = {};
            return {}; // return empty object if it can not find the config file.
        }
        const filePath = path.join(currentDir, config.configFileName);
        if (fs.existsSync(filePath)) {
            const data = parse(fs.readFileSync(filePath));
            data.__path = filePath;
            config = data;
            return config;
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
            config = {};
            return config;
        }
    }

    return (config) ? config : next();
}
