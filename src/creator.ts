import download from 'download-git-repo';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';

const projectRoot = process.cwd();
const defConfigName = 'deployer.config.js'
const targetFile = path.resolve(projectRoot, defConfigName)
const repoPath = 'https://gist.githubusercontent.com/Laev/42368d3e95b3f6263ed52176ab462831/raw/deployer.config.js'

function downloadConfigTemplate() {
  const spinner = ora('Start cloning template...')
  spinner.start();
  download(`direct:${repoPath}`, projectRoot, function (err: any) {
    if (err) {
      spinner.warn(`Some errors have occurred, please try again`);
      return
    }
    spinner.succeed(`Configuration successfully created`);
    console.log(`${chalk.green('Then you can add the `deployer start deployer.config.js` command to your package.json scripts.')}`)
  })
}
async function creator(name: any, options: any) {
  if (!fs.existsSync(targetFile)) {
    downloadConfigTemplate()
    return
  }
  const { action } = await inquirer.prompt([
    {
      name: 'action',
      type: 'list',
      message: `Target file ${chalk.cyan(targetFile)} already exists. Pick an action:`,
      choices: [
        { name: 'Overwrite', value: 'overwrite' },
        { name: 'Cancel', value: false }
      ]
    }
  ])
  if (!action) {
    return
  } else if (action === 'overwrite') {
    downloadConfigTemplate()
  }
}

export default creator
