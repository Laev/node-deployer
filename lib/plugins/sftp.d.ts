import Plugins from './index';
declare type files = Array<any>;
declare type IConfigs = {
    name: string;
    host: string;
    port: number;
    username: string;
    password: string;
    privateKeyPath: string;
    remotePath: string;
    pattern: string;
};
declare class SFTP extends Plugins {
    configs: IConfigs;
    private instance;
    constructor(files: files, localDirPath: string, configs: IConfigs);
    start(): Promise<void>;
}
export default SFTP;
