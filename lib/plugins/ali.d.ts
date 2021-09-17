import Plugins from './index';
import type { Options, ListBucketsQueryType } from 'ali-oss';
import type { Entry } from 'globby';
declare type files = Entry[];
declare type IConfigs = Options & ListBucketsQueryType;
declare class Ali extends Plugins {
    configs: IConfigs;
    private instance;
    constructor(files: files, localDirPath: string, configs: IConfigs);
    start(): Promise<void>;
    private formatPrefix;
}
export default Ali;
