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
exports.ImplicitAuthenticator = ImplicitAuthenticator;
ImplicitAuthenticator.SCHEME = "Implicit";
