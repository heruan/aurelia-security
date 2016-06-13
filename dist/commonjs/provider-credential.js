"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ProviderCredential = exports.ProviderCredential = function () {
    function ProviderCredential(provider, code) {
        _classCallCheck(this, ProviderCredential);

        this.provider = provider;
        this.code = code;
    }

    ProviderCredential.prototype.getProvider = function getProvider() {
        return this.provider;
    };

    ProviderCredential.prototype.getCode = function getCode() {
        return this.code;
    };

    return ProviderCredential;
}();