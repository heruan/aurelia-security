define(["exports", "http-utils"], function (exports, _httpUtils) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.BearerAuthenticator = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var BearerAuthenticator = exports.BearerAuthenticator = function () {
        function BearerAuthenticator(tokenCredential) {
            _classCallCheck(this, BearerAuthenticator);

            this.authorizationData = BearerAuthenticator.SCHEME + " " + tokenCredential.getToken();
        }

        BearerAuthenticator.prototype.authorizeMessage = function authorizeMessage(message) {
            message.headers.add(_httpUtils.HttpHeaders.AUTHORIZATION, this.authorizationData);
            return message;
        };

        BearerAuthenticator.prototype.getScheme = function getScheme() {
            return BearerAuthenticator.SCHEME;
        };

        return BearerAuthenticator;
    }();

    BearerAuthenticator.SCHEME = "Bearer";
});