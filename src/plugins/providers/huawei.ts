import ora from 'ora';
import chalk from 'chalk';

import type { Ora } from 'ora';

type files = any[]
type configs = {}

class Huawei {
  public files: files
  public parentPath: string
  private configs: configs
  private instance: null
  private spinner: Ora

  constructor(files: files, path: string, configs: configs) {
    this.files = files
    this.parentPath = path
    this.configs = configs
    this.instance = null
    this.spinner = ora(`server: ${chalk.green('huawei')} start uploading`)
  }
  start() {
    return new Promise((resolve, reject) => { })
  }
}

export default Huawei