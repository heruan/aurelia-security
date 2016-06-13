"use strict";

System.register([], function (_export, _context) {
    "use strict";

    var TokenCredential;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [],
        execute: function () {
            _export("TokenCredential", TokenCredential = function () {
                function TokenCredential(token) {
                    _classCallCheck(this, TokenCredential);

                    this.token = token;
                }

                TokenCredential.prototype.getToken = function getToken() {
                    return this.token;
                };

                return TokenCredential;
            }());

            _export("TokenCredential", TokenCredential);
        }
    };
});