import Client from 'ssh2-sftp-client';
import ora from 'ora';
import pAll from 'p-all';
import fs from 'fs-extra'
import chalk from 'chalk';
import Plugins from '../index'
import consoleTable from '../../utils/consoleTable'
import { _typeof } from '../../utils/common'

type files = any[]
type IConfigs = {
  name: string
  host: string
  port: number,
  username: string
  password: string
  privateKeyPath: string
  remotePath: string
  pattern: string
}

class SFTP extends Plugins {

  public configs: IConfigs
  private instance: Client

  constructor(files: files, localDirPath: string, configs: IConfigs) {
    super(files, localDirPath, configs);
    this.files = files
    this.localDirPath = localDirPath
    this.configs = configs
    this.instance = new Client()
    this.spinner = ora(`server: ${chalk.green('sftp')} start uploading`)
  }
  public async start() {
    await this.spinner.start()
    const { host, port, username, password, remotePath, privateKeyPath, pattern } = this.configs
    const formatConf = {
      host,
      port,
      username,
      password,
      privateKey: privateKeyPath ? fs.readFileSync(privateKeyPath) : undefined,
      pattern
    }
    try {
      await this.instance.connect(formatConf)
      this.instance.on('upload', info => {
        this.spinner.text = `uploading ${info.source}`
      });
      await this.instance.uploadDir(this.localDirPath, remotePath, pattern)
      this.spinner.stop()
      const fileResults = this.files.map(item => { return { name: item.name, res: { status: 200 } } })
      consoleTable(fileResults)
    }
    catch (err) {
      this.spinner.stop()
      console.log(`\n error:${err}`)
    }
    await this.instance.end();
  }
}

export default SFTP