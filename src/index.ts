import * as program from "commander";
import { Build } from "./commands/build";
import { Create } from "./commands/create";
import { Data } from "./commands/data";
import { Init } from "./commands/init";
import { cleanArgs } from "./utils/arguments";
import { getConfig } from "./utils/config";
import { ErrorMessage } from "./utils/error";

const config = getConfig();

program
  .usage("<command> [options]");

program
  .command("build")
  .description("build the project")
  .action((type, name, cmd) => {
    Build({});
  });

program
  .command("create <type> <name>")
  .description("create a new component\n\n  type: (view | ctr)\n  name: string")
  .action((type, name, cmd) => {
    Create(cmd, type, name);
  });

program
  .command("dev")
  .description("Tools for development")
  .action((type, name, cmd) => {
    ErrorMessage(cmd, "Not yet implemented.");
  });

program
  .command("init <app-name>")
  .description("create a new project")
  .option("-f, --force", "Overwrite target directory if it exists")
  .action((name, cmd) => {
    Init(name, cleanArgs(cmd));
  });

program
  .command("lint")
  .description("Check codestyle and potential errors")
  .action((type, name, cmd) => {
    ErrorMessage(cmd, "Not yet implemented.");
  });

program
  .command("pack")
  .description("Bundle the project for production")
  .action((type, name, cmd) => {
    ErrorMessage(cmd, "Not yet implemented.");
  });

program
  .command("serve")
  .description("Serve the web project locally")
  .action((type, name, cmd) => {
    ErrorMessage(cmd, "Not yet implemented.");
  });

program
  .command("test")
  .description("Run test for application")
  .action((type, name, cmd) => {
    ErrorMessage(cmd, "Not yet implemented.");
  });

program.commands.forEach((c) => c.on("--help", () => console.log()));

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

process.on("uncaughtException", (err) => {
  console.error(err);
});
