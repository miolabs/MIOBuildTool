/**
 * This command is responsible for creating new components from templated blueprints.
 */

import chalk from "chalk";
import { ErrorMessage } from "../../utils/error";
import { cleanArgs } from "../../utils/arguments";
import { component } from "./component";

export function Create(cmd, type, name): Promise<boolean> {
    const params = cleanArgs(cmd);
    switch (type) {
        case "view":
          return View(params, name);
        case "controller":
          return Controller(params, name);
        case "viewcontroller":
          return ViewController(params, name);
        default:
          ErrorMessage(params, `Unknown type ${chalk.yellow(type)}.`);
          return new Promise(() => false);
      }
}

function View(params, name) {
  return component(params, name, false, true);
}

function ViewController(params, name) {
  return component(params, name, true, true);
}

function Controller(params, name) {
  const needTemplate = params.needTemplate;
  return component(params, name, true, needTemplate);
}
