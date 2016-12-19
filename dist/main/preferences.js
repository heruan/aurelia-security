"use strict";
var Preferences = (function () {
    function Preferences() {
    }
    Preferences.prototype.get = function (key) {
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
