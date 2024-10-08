import { program } from "commander";
import {uploadCanyonCoverage} from './lib/main.js'

program
  .name("canyon")
  .version('1.0.0', "-v, --version", "see the current version of canyon-cli")
  .usage("[options or commands] arguments")
  // .addHelpText("beforeAll", CLI_BEFORE_ALL_TXT)
  // .addHelpText("after", CLI_AFTER_ALL_TXT)
  // .configureHelp({
  //   optionTerm: (option) => accent(option.flags),
  //   subcommandTerm: (cmd) => accent(cmd.name(), cmd.usage()),
  //   argumentTerm: (arg) => accent(arg.name()),
  // })
  // .addHelpCommand(false)
  .showHelpAfterError(true);



function upload() {
  return uploadCanyonCoverage()
}

program
  .command("upload").action(async () => await upload());


export const cli = async (args) => {
  try {
    await program.parseAsync(args);
  } catch (e) {}
};
