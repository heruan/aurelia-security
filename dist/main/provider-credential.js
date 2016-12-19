"use strict";
var ProviderCredential = (function () {
    function ProviderCredential(provider, code) {
        this.provider = provider;
        this.code = code;
    }
    ProviderCredential.prototype.getProvider = function () {
        return this.provider;
    };
    ProviderCredential.prototype.getCode = function () {
        return this.code;
    };
    return ProviderCredential;
}());
exports.ProviderCredential = ProviderCredential;

//# sourceMappingURL=provider-credential.js.map
