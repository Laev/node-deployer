import aliOss from 'ali-oss';
import ora from 'ora';
import pAll from 'p-all';
import chalk from 'chalk';
import consoleTable from '../../utils/consoleTable'
import { _typeof } from '../../utils/common'
import Plugins from '../index'

import type { Options, ListBucketsQueryType, PutObjectResult } from 'ali-oss';
import type { Entry } from 'globby'

type files = Entry[]
type IConfigs = Options & ListBucketsQueryType

class Ali extends Plugins {

  public configs: IConfigs
  private instance: aliOss

  constructor(files: files, localDirPath: string, configs: IConfigs) {
    super(files, localDirPath, configs);
    this.files = files
    this.localDirPath = localDirPath
    this.configs = configs
    this.instance = new aliOss(this.configs)
    this.spinner = ora(`server: ${chalk.green('aliyun')} start uploading`)
  }
  public async start() {
    await this.spinner.start()

    const uploadTask: any = this.files.reduce((tasks: any, fileObj: any) => {
      tasks.push(() => {
        this.spinner.text = `uploading ${fileObj.path}`
      })
      tasks.push(() =>
        this.instance.put(`${this.formatPrefix(this.configs.prefix)}${fileObj.path}`, `${this.localDirPath}/${fileObj.path}`)
      )
      return tasks
    }, [])
    const objects: any = await pAll(uploadTask, { concurrency: 3, stopOnError: false })

    const fileResults: PutObjectResult[] = objects.filter((item: unknown) => !!item)

    this.spinner.stop()

    // ui print
    consoleTable(fileResults)
    // console.log(`${chalk.green(`total ${this.files.length} files success √`)}`)
  }

  private formatPrefix(prefix: string | undefined): string {
    if (!prefix) {
      return ''
    }
    if (_typeof(prefix) === 'string' && prefix.charAt(prefix.length - 1) !== '/') {
      prefix += '/'
    }
    return prefix
  }
}

export default Ali