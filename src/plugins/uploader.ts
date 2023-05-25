import path from 'path';
import chalk from 'chalk';
import fs from 'fs-extra';
import inquirer from 'inquirer';
import globby from 'globby';
import PQueue from 'p-queue';

import { _typeof } from '../utils/common'
import Ali from './providers/ali'
import Huawei from './providers/huawei'
import SFTP from './providers/sftp'

import type { Options, ListBucketsQueryType } from 'ali-oss';

const projectRoot = process.cwd();
const defConfigName = 'deployer.config.js'
const defService = ['ali', 'huawei', 'sftp']

enum ConfigKey {
  ali = 'aliConfig',
  huawei = 'huaweiConfig',
  sftp = 'sftpConfig'
}

type Service = 'ali' | 'huawei' | 'sftp'

type config = {
  dir: string
  server: Service | Service[]
  pattern?: string | undefined,
  [ConfigKey.ali]: Options & ListBucketsQueryType | undefined,
  [ConfigKey.huawei]: unknown | undefined,
  [ConfigKey.sftp]: unknown | undefined,
}

async function uploader(name: any, options: any) {
  const configFileName = options?.args?.[0] || defConfigName;
  const targetFile = path.resolve(projectRoot, configFileName)
  if (!fs.existsSync(targetFile)) {
    console.log(`\n${chalk.red(`Can not find config file. You can run 'deployer init' to create it`)}\n`);
    return
  }

  const config: config = require(targetFile);
  if (!config.dir) {
    console.log(`\n${chalk.red('Can not find `dir` in configs')}\n`);
    return
  }

  if (!config.server) {
    console.log(`\n${chalk.red('Can not find `server` in configs')}\n`);
    return
  }

  let server = config.server

  if (_typeof(server) === 'string') {
    (server as Service[]) = [server as Service]
  }

  if (_typeof(server) !== 'array') {
    console.log(`\n${chalk.red('Unaccepted server type')}\n`);
    return
  }

  const supported: Service[] = [];
  const notSupported: string[] = [];
  (server as Service[]).forEach((item) => {
    if (defService.includes(item)) {
      supported.push(item)
    } else {
      notSupported.push(item)
    }
  })

  if (!supported.length) {
    console.log(`\nService not supported: ${chalk.red(notSupported.join(' '))}\n`);
    return
  }
  if (notSupported.length) {
    const { action } = await inquirer.prompt([
      {
        name: 'action',
        type: 'list',
        message: `Service not supported: ${chalk.red(notSupported.join(' '))}. If you choose to continue, we will skip them. Pick an action:`,
        choices: [
          { name: 'Continue', value: 'continue' },
          { name: 'Cancel', value: false }
        ]
      }
    ])
    if (action !== 'continue') {
      return
    }
  }

  const queue = new PQueue({ concurrency: 1 }); // 对列
  const filesPath = path.join(projectRoot, config.dir)
  // 获取所有文件路径   "**" 为递归文件夹
  const files = await globby((config?.pattern || '**'), {
    cwd: filesPath,
    objectMode: true
  })
  for (const item of supported) {
    const configKey = ConfigKey[item]
    const serverConfig: any = config?.[configKey]
    // console.log('serverConfig', serverConfig)
    switch (item) {
      case 'ali':
        try {
          if (_typeof(serverConfig) !== 'object') {
            console.log(`\n${chalk.red('Unaccepted server config type')}\n`);
          }
          queue.add(() => new Ali(files, filesPath, serverConfig).start())
        }
        catch (err) {
          console.log(err)
        }
        break;
      case 'huawei':
        try {
          if (_typeof(serverConfig) !== 'object') {
            console.log(`\n${chalk.red('Unaccepted server config type')}\n`);
          }
          queue.add(() => new Huawei(files, filesPath, serverConfig).start())

        }
        catch (err) {
          console.log(err)
        }
        break;
      case 'sftp':
        try {
          if (_typeof(serverConfig) === 'object') {
            serverConfig.pattern = config?.pattern || "**"
            queue.add(() => new SFTP(files, filesPath, serverConfig).start())
          } else if (_typeof(serverConfig) === 'array') {
            serverConfig.forEach((item: any) => queue.add(() => new SFTP(files, filesPath, { ...item, pattern: config?.pattern || "**" }).start()))
          } else {
            console.log(`\n${chalk.red('Unaccepted server config')}\n`);
          }
        }
        catch (err) {
          console.log(err)
        }
        break;
      default:
        break;
    }
  }
  // console.log('queue', queue)
};

export default uploader