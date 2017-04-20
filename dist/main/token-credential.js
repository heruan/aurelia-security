"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
