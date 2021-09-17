import ora from 'ora';

import type { Ora } from 'ora';
import type { Entry } from 'globby'

type files = Entry[]

export default class Plugins {
  public files: files
  public localDirPath: string
  public configs: unknown
  public spinner: Ora

  constructor(files: files, parentPath: string, configs: unknown) {
    this.files = files
    this.localDirPath = parentPath
    this.configs = configs
    this.spinner = ora(`start uploading`)
  }
}

