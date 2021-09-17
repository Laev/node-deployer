"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var download_git_repo_1 = tslib_1.__importDefault(require("download-git-repo"));
var ora_1 = tslib_1.__importDefault(require("ora"));
var fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
var path_1 = tslib_1.__importDefault(require("path"));
var chalk_1 = tslib_1.__importDefault(require("chalk"));
var inquirer_1 = tslib_1.__importDefault(require("inquirer"));
var projectRoot = process.cwd();
var defConfigName = 'deployer.config.js';
var targetFile = path_1.default.resolve(projectRoot, defConfigName);
var repoPath = 'https://gist.githubusercontent.com/Laev/42368d3e95b3f6263ed52176ab462831/raw/ec014ff0c8109ac33dbe2deb27ae71c93a577ff5/deployer.config.js';
function downloadConfigTemplate() {
    var spinner = ora_1.default('Start cloning template...');
    spinner.start();
    download_git_repo_1.default("direct:" + repoPath, projectRoot, function (err) {
        if (err) {
            spinner.warn("Some errors have occurred, please try again");
            return;
        }
        spinner.succeed("Configuration successfully created");
        console.log("" + chalk_1.default.green('Then you can add the `deployer start deployer.config.js` command to your package.json scripts.'));
    });
}
function creator(name, options) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var action;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!fs_extra_1.default.existsSync(targetFile)) {
                        downloadConfigTemplate();
                        return [2];
                    }
                    return [4, inquirer_1.default.prompt([
                            {
                                name: 'action',
                                type: 'list',
                                message: "Target file " + chalk_1.default.cyan(targetFile) + " already exists. Pick an action:",
                                choices: [
                                    { name: 'Overwrite', value: 'overwrite' },
                                    { name: 'Cancel', value: false }
                                ]
                            }
                        ])];
                case 1:
                    action = (_a.sent()).action;
                    if (!action) {
                        return [2];
                    }
                    else if (action === 'overwrite') {
                        downloadConfigTemplate();
                    }
                    return [2];
            }
        });
    });
}
exports.default = creator;
