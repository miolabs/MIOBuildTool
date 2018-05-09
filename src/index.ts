import * as program from "commander";
import { Create } from "./commands/create";
import { Init } from "./commands/init";
import { cleanArgs } from "./utils/arguments";
import { getConfig } from "./utils/config";

const config = getConfig();

program
  .usage("<command> [options]");

program
  .command("init <app-name>")
  .description("create a new project")
  .option("-f, --force", "Overwrite target directory if it exists")
  .action((name, cmd) => {
    Init(name, cleanArgs(cmd));
  });

program
  .command("create <type> <name>")
  .description("create a new component\n\n  type: (view | ctr)\n  name: string")
  .action((type, name, cmd) => {
    Create(cmd, type, name);
  });

program.commands.forEach((c) => c.on("--help", () => console.log()));

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

process.on("uncaughtException", (err) => {
  console.error(err);
});
