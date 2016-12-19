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
    return ImplicitAuthenticator;
}());
ImplicitAuthenticator.SCHEME = "Implicit";
exports.ImplicitAuthenticator = ImplicitAuthenticator;

//# sourceMappingURL=implicit-authenticator.js.map
