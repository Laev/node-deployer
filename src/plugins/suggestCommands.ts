/* smart suggestions, code from vue-cli */
import program from 'commander'
import chalk from 'chalk'
import leven from 'leven'

function suggestCommands(unknownCommand: string) {
  const availableCommands = program.commands.map((cmd: any) => cmd._name);
  let suggestion: string = '';

  availableCommands.forEach((cmd) => {
    const isBestMatch = leven(cmd, unknownCommand) < leven(suggestion || "", unknownCommand);
    if (leven(cmd, unknownCommand) < 3 && isBestMatch) {
      suggestion = cmd;
    }
  });

  if (suggestion) {
    console.log(`${chalk.red(`Did you mean ${chalk.yellow(suggestion)}?`)}`);
  }
}

export default suggestCommands
