"use strict";
var Preferences = (function () {
    function Preferences() {
    }
    Preferences.prototype.get = function (key, type) {
        var generics = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            generics[_i - 2] = arguments[_i];
        }
        throw new Error(this.constructor.name + " must implement " + this.get.name);
    };
    Preferences.prototype.set = function (key, item) {
        throw new Error(this.constructor.name + " must implement " + this.set.name);
    };
    Preferences.prototype.remove = function (key) {
        throw new Error(this.constructor.name + " must implement " + this.remove.name);
    };
    return Preferences;
}());
exports.Preferences = Preferences;

//# sourceMappingURL=preferences.js.map
