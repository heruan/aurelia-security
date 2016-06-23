"use strict";
var ImplicitAuthenticator = (function () {
    function ImplicitAuthenticator() {
    }
    ImplicitAuthenticator.prototype.authorizeMessage = function (message) {
        return message;
    };
    ImplicitAuthenticator.prototype.getScheme = function () {
        return ImplicitAuthenticator.SCHEME;
    };
    ImplicitAuthenticator.SCHEME = "Implicit";
    return ImplicitAuthenticator;
}());
exports.ImplicitAuthenticator = ImplicitAuthenticator;
//# sourceMappingURL=implicit-authenticator.js.map