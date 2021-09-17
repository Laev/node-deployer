"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var commander_1 = tslib_1.__importDefault(require("commander"));
var chalk_1 = tslib_1.__importDefault(require("chalk"));
var leven_1 = tslib_1.__importDefault(require("leven"));
function suggestCommands(unknownCommand) {
    var availableCommands = commander_1.default.commands.map(function (cmd) { return cmd._name; });
    var suggestion = '';
    availableCommands.forEach(function (cmd) {
        var isBestMatch = leven_1.default(cmd, unknownCommand) < leven_1.default(suggestion || "", unknownCommand);
        if (leven_1.default(cmd, unknownCommand) < 3 && isBestMatch) {
            suggestion = cmd;
        }
    });
    if (suggestion) {
        console.log("" + chalk_1.default.red("Did you mean " + chalk_1.default.yellow(suggestion) + "?"));
    }
}
exports.default = suggestCommands;
