"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Colors = /** @class */ (function () {
    function Colors() {
        this.Reset = "\x1b[0m";
        this.Bright = "\x1b[1m";
        this.Dim = "\x1b[2m";
        this.Underline = "\x1b[4m";
        this.Blink = "\x1b[5m";
        this.Reverse = "\x1b[7m";
        this.Hidden = "\x1b[8m";
        this.FgBlack = "\x1b[30m";
        this.FgRed = "\x1b[31m";
        this.FgGreen = "\x1b[32m";
        this.FgYellow = "\x1b[33m";
        this.FgBlue = "\x1b[34m";
        this.FgMagenta = "\x1b[35m";
        this.FgCyan = "\x1b[36m";
        this.FgWhite = "\x1b[37m";
        this.BgBlack = "\x1b[40m";
        this.BgRed = "\x1b[41m";
        this.BgGreen = "\x1b[42m";
        this.BgYellow = "\x1b[43m";
        this.BgBlue = "\x1b[44m";
        this.BgMagenta = "\x1b[45m";
        this.BgCyan = "\x1b[46m";
        this.BgWhite = "\x1b[47m";
    }
    //FR
    Colors.prototype.black = function (str) {
        return "" + this.FgBlack + str + this.Reset;
    };
    Colors.prototype.red = function (str) {
        return "" + this.FgRed + str + this.Reset;
    };
    Colors.prototype.green = function (str) {
        return "" + this.FgGreen + str + this.Reset;
    };
    Colors.prototype.yellow = function (str) {
        return "" + this.FgYellow + str + this.Reset;
    };
    Colors.prototype.blue = function (str) {
        return "" + this.FgBlue + str + this.Reset;
    };
    Colors.prototype.magenta = function (str) {
        return "" + this.FgMagenta + str + this.Reset;
    };
    Colors.prototype.cyan = function (str) {
        return "" + this.FgCyan + str + this.Reset;
    };
    Colors.prototype.white = function (str) {
        return "" + this.FgWhite + str + this.Reset;
    };
    //BG
    Colors.prototype.bgBlack = function (str) {
        return "" + this.BgBlack + str + this.Reset;
    };
    Colors.prototype.bgRed = function (str) {
        return "" + this.BgRed + str + this.Reset;
    };
    Colors.prototype.bgGreen = function (str) {
        return "" + this.BgGreen + str + this.Reset;
    };
    Colors.prototype.bgYellow = function (str) {
        return "" + this.BgYellow + str + this.Reset;
    };
    Colors.prototype.bgBlue = function (str) {
        return "" + this.BgBlue + str + this.Reset;
    };
    Colors.prototype.bgMagenta = function (str) {
        return "" + this.BgMagenta + str + this.Reset;
    };
    Colors.prototype.bgCyan = function (str) {
        return "" + this.BgCyan + str + this.Reset;
    };
    Colors.prototype.bgWhite = function (str) {
        return "" + this.BgWhite + str + this.Reset;
    };
    //Other
    Colors.prototype.reset = function (str) {
        return "" + this.Reset + str + this.Reset;
    };
    Colors.prototype.bright = function (str) {
        return "" + this.Bright + str + this.Reset;
    };
    Colors.prototype.dim = function (str) {
        return "" + this.Dim + str + this.Reset;
    };
    Colors.prototype.underline = function (str) {
        return "" + this.Underline + str + this.Reset;
    };
    Colors.prototype.blink = function (str) {
        return "" + this.Blink + str + this.Reset;
    };
    Colors.prototype.reverse = function (str) {
        return "" + this.Reverse + str + this.Reset;
    };
    Colors.prototype.hidden = function (str) {
        return "" + this.Hidden + str + this.Reset;
    };
    return Colors;
}());
exports.default = new Colors();
//# sourceMappingURL=colors.js.map