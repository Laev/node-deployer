"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ssh2_sftp_client_1 = tslib_1.__importDefault(require("ssh2-sftp-client"));
var ora_1 = tslib_1.__importDefault(require("ora"));
var fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
var chalk_1 = tslib_1.__importDefault(require("chalk"));
var index_1 = tslib_1.__importDefault(require("./index"));
var consoleTable_1 = tslib_1.__importDefault(require("../utils/consoleTable"));
var SFTP = (function (_super) {
    tslib_1.__extends(SFTP, _super);
    function SFTP(files, localDirPath, configs) {
        var _this = _super.call(this, files, localDirPath, configs) || this;
        _this.files = files;
        _this.localDirPath = localDirPath;
        _this.configs = configs;
        _this.instance = new ssh2_sftp_client_1.default();
        _this.spinner = ora_1.default("server: " + chalk_1.default.green('sftp') + " start uploading");
        return _this;
    }
    SFTP.prototype.start = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, host, port, username, password, remotePath, privateKeyPath, pattern, formatConf, fileResults, err_1;
            var _this = this;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, this.spinner.start()];
                    case 1:
                        _b.sent();
                        _a = this.configs, host = _a.host, port = _a.port, username = _a.username, password = _a.password, remotePath = _a.remotePath, privateKeyPath = _a.privateKeyPath, pattern = _a.pattern;
                        formatConf = {
                            host: host,
                            port: port,
                            username: username,
                            password: password,
                            privateKey: privateKeyPath ? fs_extra_1.default.readFileSync(privateKeyPath) : undefined,
                            pattern: pattern
                        };
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 5, , 6]);
                        return [4, this.instance.connect(formatConf)];
                    case 3:
                        _b.sent();
                        this.instance.on('upload', function (info) {
                            _this.spinner.text = "uploading " + info.source;
                        });
                        return [4, this.instance.uploadDir(this.localDirPath, remotePath, pattern)];
                    case 4:
                        _b.sent();
                        this.spinner.stop();
                        fileResults = this.files.map(function (item) { return { name: item.name, res: { status: 200 } }; });
                        consoleTable_1.default(fileResults);
                        return [3, 6];
                    case 5:
                        err_1 = _b.sent();
                        this.spinner.stop();
                        console.log("\n error:" + err_1);
                        return [3, 6];
                    case 6: return [4, this.instance.end()];
                    case 7:
                        _b.sent();
                        return [2];
                }
            });
        });
    };
    return SFTP;
}(index_1.default));
exports.default = SFTP;
