import program from 'commander'
import chalk from 'chalk'
import creator from "./creator"
import uploader from "./uploader"
import suggestCommands from "./suggestCommands"

// version
program
  .version(chalk.green(`${require("../package.json").version}`))
  .usage("<command> [options]");

// initialization
program
  .command("init")
  .description("create a config file in your project")
  // .option() // TODO mode(default自动生成 guide引导模式)
  .action((name, options) => {
    creator(name, options);
  });

// start upload
program
  .command("start")
  .description("start upload task")
  // .option() // TODO 补充参数（对一些关键性参数的修改，如server)
  .action((name, options) => {
    uploader(name, options);
    // 动态import写法
    // const { default: uploader } = await import('./uploader');
    // uploader(name, options)
  });

// display help information when entering unknown commands
program.on("command:*", ([cmd]) => {
  program.outputHelp();
  console.log(`\n${chalk.red(`Unknown command ${chalk.yellow(cmd)}\n`)}`);
  suggestCommands(cmd);
  process.exitCode = 1;
});

program.parse(process.argv);
