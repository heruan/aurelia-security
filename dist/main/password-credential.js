"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PasswordCredential = (function () {
    function PasswordCredential(identity, password) {
        this.identity = identity;
        this.password = password;
    }
    PasswordCredential.prototype.getIdentity = function () {
        return this.identity;
    };
    PasswordCredential.prototype.getPassword = function () {
        return this.password;
    };
    return PasswordCredential;
}());
exports.PasswordCredential = PasswordCredential;

//# sourceMappingURL=password-credential.js.map
