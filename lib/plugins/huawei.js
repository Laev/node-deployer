"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ora_1 = tslib_1.__importDefault(require("ora"));
var chalk_1 = tslib_1.__importDefault(require("chalk"));
var Huawei = (function () {
    function Huawei(files, path, configs) {
        this.files = files;
        this.parentPath = path;
        this.configs = configs;
        this.instance = null;
        this.spinner = ora_1.default("server: " + chalk_1.default.green('huawei') + " start uploading");
    }
    Huawei.prototype.start = function () {
        return new Promise(function (resolve, reject) { });
    };
    return Huawei;
}());
exports.default = Huawei;
