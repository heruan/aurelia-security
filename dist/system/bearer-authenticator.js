"use strict";

System.register(["http-utils"], function (_export, _context) {
    "use strict";

    var HttpHeaders, BearerAuthenticator;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_httpUtils) {
            HttpHeaders = _httpUtils.HttpHeaders;
        }],
        execute: function () {
            _export("BearerAuthenticator", BearerAuthenticator = function () {
                function BearerAuthenticator(tokenCredential) {
                    _classCallCheck(this, BearerAuthenticator);

                    this.authorizationData = BearerAuthenticator.SCHEME + " " + tokenCredential.getToken();
                }

                BearerAuthenticator.prototype.authorizeMessage = function authorizeMessage(message) {
                    message.headers.add(HttpHeaders.AUTHORIZATION, this.authorizationData);
                    return message;
                };

                BearerAuthenticator.prototype.getScheme = function getScheme() {
                    return BearerAuthenticator.SCHEME;
                };

                return BearerAuthenticator;
            }());

            _export("BearerAuthenticator", BearerAuthenticator);

            BearerAuthenticator.SCHEME = "Bearer";
        }
    };
});