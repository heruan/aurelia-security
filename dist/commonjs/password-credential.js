"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PasswordCredential = exports.PasswordCredential = function () {
    function PasswordCredential(identity, password) {
        _classCallCheck(this, PasswordCredential);

        this.identity = identity;
        this.password = password;
    }

    PasswordCredential.prototype.getIdentity = function getIdentity() {
        return this.identity;
    };

    PasswordCredential.prototype.getPassword = function getPassword() {
        return this.password;
    };

    return PasswordCredential;
}();