"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._typeof = void 0;
function _typeof(val) {
    var _a;
    var type = Object.prototype.toString.call(val);
    return (((_a = type.match(/\[object (.*?)\]/)) === null || _a === void 0 ? void 0 : _a[1]) || '').toLowerCase();
}
exports._typeof = _typeof;
