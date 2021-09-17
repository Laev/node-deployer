"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var path_1 = tslib_1.__importDefault(require("path"));
var chalk_1 = tslib_1.__importDefault(require("chalk"));
var fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
var inquirer_1 = tslib_1.__importDefault(require("inquirer"));
var globby_1 = tslib_1.__importDefault(require("globby"));
var p_queue_1 = tslib_1.__importDefault(require("p-queue"));
var common_1 = require("./utils/common");
var ali_1 = tslib_1.__importDefault(require("./plugins/ali"));
var huawei_1 = tslib_1.__importDefault(require("./plugins/huawei"));
var sftp_1 = tslib_1.__importDefault(require("./plugins/sftp"));
var projectRoot = process.cwd();
var defConfigName = 'deployer.config.js';
var defService = ['ali', 'huawei', 'sftp'];
var ConfigKey;
(function (ConfigKey) {
    ConfigKey["ali"] = "aliConfig";
    ConfigKey["huawei"] = "huaweiConfig";
    ConfigKey["sftp"] = "sftpConfig";
})(ConfigKey || (ConfigKey = {}));
function uploader(name, options) {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var configFileName, targetFile, config, server, supported, notSupported, action, queue, filesPath, files, _loop_1, _i, supported_1, item;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    configFileName = ((_a = options === null || options === void 0 ? void 0 : options.args) === null || _a === void 0 ? void 0 : _a[0]) || defConfigName;
                    targetFile = path_1.default.resolve(projectRoot, configFileName);
                    if (!fs_extra_1.default.existsSync(targetFile)) {
                        console.log("\n" + chalk_1.default.red("Can not find config file. You can run 'deployer init' to create it") + "\n");
                        return [2];
                    }
                    config = require(targetFile);
                    if (!config.dir) {
                        console.log("\n" + chalk_1.default.red('Can not find `dir` in configs') + "\n");
                        return [2];
                    }
                    if (!config.server) {
                        console.log("\n" + chalk_1.default.red('Can not find `server` in configs') + "\n");
                        return [2];
                    }
                    server = config.server;
                    if (common_1._typeof(server) === 'string') {
                        server = [server];
                    }
                    if (common_1._typeof(server) !== 'array') {
                        console.log("\n" + chalk_1.default.red('Unaccepted server type') + "\n");
                        return [2];
                    }
                    supported = [];
                    notSupported = [];
                    server.forEach(function (item) {
                        if (defService.includes(item)) {
                            supported.push(item);
                        }
                        else {
                            notSupported.push(item);
                        }
                    });
                    if (!supported.length) {
                        console.log("\nService not supported: " + chalk_1.default.red(notSupported.join(' ')) + "\n");
                        return [2];
                    }
                    if (!notSupported.length) return [3, 2];
                    return [4, inquirer_1.default.prompt([
                            {
                                name: 'action',
                                type: 'list',
                                message: "Service not supported: " + chalk_1.default.red(notSupported.join(' ')) + ". If you choose to continue, we will skip them. Pick an action:",
                                choices: [
                                    { name: 'Continue', value: 'continue' },
                                    { name: 'Cancel', value: false }
                                ]
                            }
                        ])];
                case 1:
                    action = (_b.sent()).action;
                    if (action !== 'continue') {
                        return [2];
                    }
                    _b.label = 2;
                case 2:
                    queue = new p_queue_1.default({ concurrency: 1 });
                    filesPath = path_1.default.join(projectRoot, config.dir);
                    return [4, globby_1.default(((config === null || config === void 0 ? void 0 : config.pattern) || '**'), {
                            cwd: filesPath,
                            objectMode: true
                        })];
                case 3:
                    files = _b.sent();
                    _loop_1 = function (item) {
                        var configKey = ConfigKey[item];
                        var serverConfig = config === null || config === void 0 ? void 0 : config[configKey];
                        switch (item) {
                            case 'ali':
                                try {
                                    if (common_1._typeof(serverConfig) !== 'object') {
                                        console.log("\n" + chalk_1.default.red('Unaccepted server config type') + "\n");
                                    }
                                    queue.add(function () { return new ali_1.default(files, filesPath, serverConfig).start(); });
                                }
                                catch (err) {
                                    console.log(err);
                                }
                                break;
                            case 'huawei':
                                try {
                                    if (common_1._typeof(serverConfig) !== 'object') {
                                        console.log("\n" + chalk_1.default.red('Unaccepted server config type') + "\n");
                                    }
                                    queue.add(function () { return new huawei_1.default(files, filesPath, serverConfig).start(); });
                                }
                                catch (err) {
                                    console.log(err);
                                }
                                break;
                            case 'sftp':
                                try {
                                    if (common_1._typeof(serverConfig) === 'object') {
                                        serverConfig.pattern = (config === null || config === void 0 ? void 0 : config.pattern) || "**";
                                        queue.add(function () { return new sftp_1.default(files, filesPath, serverConfig).start(); });
                                    }
                                    else if (common_1._typeof(serverConfig) === 'array') {
                                        serverConfig.forEach(function (item) { return queue.add(function () { return new sftp_1.default(files, filesPath, tslib_1.__assign(tslib_1.__assign({}, item), { pattern: (config === null || config === void 0 ? void 0 : config.pattern) || "**" })).start(); }); });
                                    }
                                    else {
                                        console.log("\n" + chalk_1.default.red('Unaccepted server config') + "\n");
                                    }
                                }
                                catch (err) {
                                    console.log(err);
                                }
                                break;
                            default:
                                break;
                        }
                    };
                    for (_i = 0, supported_1 = supported; _i < supported_1.length; _i++) {
                        item = supported_1[_i];
                        _loop_1(item);
                    }
                    return [2];
            }
        });
    });
}
;
exports.default = uploader;
