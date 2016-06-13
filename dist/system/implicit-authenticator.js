"use strict";

System.register([], function (_export, _context) {
    "use strict";

    var ImplicitAuthenticator;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [],
        execute: function () {
            _export("ImplicitAuthenticator", ImplicitAuthenticator = function () {
                function ImplicitAuthenticator() {
                    _classCallCheck(this, ImplicitAuthenticator);
                }

                ImplicitAuthenticator.prototype.authorizeMessage = function authorizeMessage(message) {
                    return message;
                };

                ImplicitAuthenticator.prototype.getScheme = function getScheme() {
                    return ImplicitAuthenticator.SCHEME;
                };

                return ImplicitAuthenticator;
            }());

            _export("ImplicitAuthenticator", ImplicitAuthenticator);

            ImplicitAuthenticator.SCHEME = "Implicit";
        }
    };
});