"use strict";

/**
 * Get the config files based on https://github.com/3rd-Eden/find-package-json. MIT.
 */

import * as path from "path";
import * as fs from "fs-extra";
import { config } from "./ProjectHandler";

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
        return {};
    }
}

/**
 * Find mioconfig.json files. Blocking recursive search.
 * @api public
 */
export function getConfig(): any {
    let root = process.cwd();

    /**
     * Return the parsed mioconfig.json that we find in a parent folder.
     *
     * @returns config value plus __filepath attribute for the config file location.
     */
    function next(): any {
        if (root.match(/^(\w:\\|\/)$/)) {
            return {}; // return empty object if it can not find the config file.
        }
        const file = path.join(root, config.configFileName);
        if (fs.existsSync(file)) {
            const data = parse(fs.readFileSync(file));
            data.__path = file;
            return data;
        } else {
            root = path.resolve(root, "..");
            return next();
        }
    }
    return next();
}
