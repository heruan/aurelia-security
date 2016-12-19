"use strict";
var TokenCredential = (function () {
    function TokenCredential(token) {
        this.token = token;
    }
    TokenCredential.prototype.getToken = function () {
        return this.token;
    };
    return TokenCredential;
}());
exports.TokenCredential = TokenCredential;

//# sourceMappingURL=token-credential.js.map
