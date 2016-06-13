"use strict";

System.register(["http-utils"], function (_export, _context) {
    "use strict";

    var HttpHeaders, BasicAuthenticator;

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
            _export("BasicAuthenticator", BasicAuthenticator = function () {
                function BasicAuthenticator(passwordCredential) {
                    _classCallCheck(this, BasicAuthenticator);

                    this.authorizationData = BasicAuthenticator.SCHEME + " " + btoa([passwordCredential.getIdentity(), passwordCredential.getPassword()].join(BasicAuthenticator.DELIMITER));
                }

                BasicAuthenticator.prototype.authorizeMessage = function authorizeMessage(message) {
                    message.headers.add(HttpHeaders.AUTHORIZATION, this.authorizationData);
                    return message;
                };

                BasicAuthenticator.prototype.getScheme = function getScheme() {
                    return BasicAuthenticator.SCHEME;
                };

                return BasicAuthenticator;
            }());

            _export("BasicAuthenticator", BasicAuthenticator);

            BasicAuthenticator.SCHEME = "Basic";
            BasicAuthenticator.DELIMITER = ":";
        }
    };
});