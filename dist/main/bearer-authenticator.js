"use strict";
var aurelia_http_utils_1 = require("aurelia-http-utils");
var BearerAuthenticator = (function () {
    function BearerAuthenticator(tokenCredential) {
        this.authorizationData = BearerAuthenticator.SCHEME + " " + tokenCredential.getToken();
    }
    BearerAuthenticator.prototype.authorizeMessage = function (message) {
        message.headers.add(aurelia_http_utils_1.HttpHeaders.AUTHORIZATION, this.authorizationData);
        return message;
    };
    BearerAuthenticator.prototype.getScheme = function () {
        return BearerAuthenticator.SCHEME;
    };
    return BearerAuthenticator;
}());
exports.BearerAuthenticator = BearerAuthenticator;
BearerAuthenticator.SCHEME = "Bearer";
