declare type files = Array<any>;
declare type configs = {};
declare class Huawei {
    files: files;
    parentPath: string;
    private configs;
    private instance;
    private spinner;
    constructor(files: files, path: string, configs: configs);
    start(): Promise<unknown>;
}
export default Huawei;
