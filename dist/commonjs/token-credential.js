"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TokenCredential = exports.TokenCredential = function () {
    function TokenCredential(token) {
        _classCallCheck(this, TokenCredential);

        this.token = token;
    }

    TokenCredential.prototype.getToken = function getToken() {
        return this.token;
    };

    return TokenCredential;
}();