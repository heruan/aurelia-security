define(["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var ImplicitAuthenticator = exports.ImplicitAuthenticator = function () {
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
    }();

    ImplicitAuthenticator.SCHEME = "Implicit";
});