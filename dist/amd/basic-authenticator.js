define(["exports", "http-utils"], function (exports, _httpUtils) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.BasicAuthenticator = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var BasicAuthenticator = exports.BasicAuthenticator = function () {
        function BasicAuthenticator(passwordCredential) {
            _classCallCheck(this, BasicAuthenticator);

            this.authorizationData = BasicAuthenticator.SCHEME + " " + btoa([passwordCredential.getIdentity(), passwordCredential.getPassword()].join(BasicAuthenticator.DELIMITER));
        }

        BasicAuthenticator.prototype.authorizeMessage = function authorizeMessage(message) {
            message.headers.add(_httpUtils.HttpHeaders.AUTHORIZATION, this.authorizationData);
            return message;
        };

        BasicAuthenticator.prototype.getScheme = function getScheme() {
            return BasicAuthenticator.SCHEME;
        };

        return BasicAuthenticator;
    }();

    BasicAuthenticator.SCHEME = "Basic";
    BasicAuthenticator.DELIMITER = ":";
});