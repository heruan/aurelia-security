"use strict";
var aurelia_http_utils_1 = require("aurelia-http-utils");
var BasicAuthenticator = (function () {
    function BasicAuthenticator(passwordCredential) {
        this.authorizationData = BasicAuthenticator.SCHEME + " " + btoa([
            passwordCredential.getIdentity(), passwordCredential.getPassword()
        ].join(BasicAuthenticator.DELIMITER));
    }
    BasicAuthenticator.prototype.authorizeMessage = function (message) {
        message.headers.add(aurelia_http_utils_1.HttpHeaders.AUTHORIZATION, this.authorizationData);
        return message;
    };
    BasicAuthenticator.prototype.getScheme = function () {
        return BasicAuthenticator.SCHEME;
    };
    return BasicAuthenticator;
}());
BasicAuthenticator.SCHEME = "Basic";
BasicAuthenticator.DELIMITER = ":";
exports.BasicAuthenticator = BasicAuthenticator;

//# sourceMappingURL=basic-authenticator.js.map
