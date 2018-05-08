"use strict";

import * as path from "path";
import * as fs from "fs-extra";

/**
 * Attempt to somewhat safely parse the JSON.
 *
 * @param data JSON blob that needs to be parsed.
 * @returns Parsed JSON or false.
 * @api private
 */
function parse(data: any): any|false {
    data = data.toString("utf-8");

    //
    // Remove a possible UTF-8 BOM (byte order marker) as this can lead to parse
    // values when passed in to the JSON.parse.
    //
    if (data.charCodeAt(0) === 0xFEFF) {
        data = data.slice(1);
    }

    try {
        return JSON.parse(data);
    } catch (e) {
        return false;
    }
}

/**
 * Find mioconfig.json files.
 *
 * @param root The root directory we should start searching in.
 * @returns Iterator interface.
 * @api public
 */
export function find(root: string|any): any {
    root = root || process.cwd();
    if (typeof root !== "string") {
        if (typeof root === "object" && typeof root.filename === "string") {
            root = root.filename;
        } else {
            throw new Error("Must pass a filename string or a module object to finder");
        }
    }
    return {
        /**
         * Return the parsed mioconfig.json that we find in a parent folder.
         *
         * @returns Value, filename and indication if the iteration is done.
         * @api public
         */
        next: function next(): any {
            if (root.match(/^(\w:\\|\/)$/)) {
                return {
                    value: undefined,
                    filename: undefined,
                    done: true,
                };
            }

            const file = path.join(root, "mioconfig.json");
            let data = null;

            root = path.resolve(root, "..");

            if (fs.existsSync(file) && (data = parse(fs.readFileSync(file)))) {
                data.__path = file;

                return {
                    value: data,
                    filename: file,
                    done: false,
                };
            }

            return next();
        },
    };
}
