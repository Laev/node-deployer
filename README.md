
# @gdyfe/node-deployer

The deployer running in the node and upload the project to the remote.Currently we offer services of SFTP and Aliyun OSS

## Installation

Install @gdyfe/node-deployer with npm

```bash
  npm install @gdyfe/node-deployer -D
```

with yarn

```bash
  yarn add @gdyfe/node-deployer -D
```

## Usage/Examples

Download default config template in your project

```bash
  deployer init
```

When you fill in the configuration, you can start uploading

```bash
  deployer start
```

**All configuration items and instructions are in the template*

## Support

- [ssh2-sftp-client](https://github.com/theophilusx/ssh2-sftp-client)

- [ali-oss](https://github.com/ali-sdk/ali-oss)

## License

[MIT](https://choosealicense.com/licenses/mit/)
