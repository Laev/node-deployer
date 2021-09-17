"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ali_oss_1 = tslib_1.__importDefault(require("ali-oss"));
var ora_1 = tslib_1.__importDefault(require("ora"));
var p_all_1 = tslib_1.__importDefault(require("p-all"));
var chalk_1 = tslib_1.__importDefault(require("chalk"));
var consoleTable_1 = tslib_1.__importDefault(require("../utils/consoleTable"));
var common_1 = require("../utils/common");
var index_1 = tslib_1.__importDefault(require("./index"));
var Ali = (function (_super) {
    tslib_1.__extends(Ali, _super);
    function Ali(files, localDirPath, configs) {
        var _this = _super.call(this, files, localDirPath, configs) || this;
        _this.files = files;
        _this.localDirPath = localDirPath;
        _this.configs = configs;
        _this.instance = new ali_oss_1.default(_this.configs);
        _this.spinner = ora_1.default("server: " + chalk_1.default.green('aliyun') + " start uploading");
        return _this;
    }
    Ali.prototype.start = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var uploadTask, objects, fileResults;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.spinner.start()];
                    case 1:
                        _a.sent();
                        uploadTask = this.files.reduce(function (tasks, fileObj) {
                            tasks.push(function () {
                                _this.spinner.text = "uploading " + fileObj.path;
                            });
                            tasks.push(function () {
                                return _this.instance.put("" + _this.formatPrefix(_this.configs.prefix) + fileObj.path, _this.localDirPath + "/" + fileObj.path);
                            });
                            return tasks;
                        }, []);
                        return [4, p_all_1.default(uploadTask, { concurrency: 3, stopOnError: false })];
                    case 2:
                        objects = _a.sent();
                        fileResults = objects.filter(function (item) { return !!item; });
                        this.spinner.stop();
                        consoleTable_1.default(fileResults);
                        return [2];
                }
            });
        });
    };
    Ali.prototype.formatPrefix = function (prefix) {
        if (!prefix) {
            return '';
        }
        if (common_1._typeof(prefix) === 'string' && prefix.charAt(prefix.length - 1) !== '/') {
            prefix += '/';
        }
        return prefix;
    };
    return Ali;
}(index_1.default));
exports.default = Ali;
