"use strict";

System.register([], function (_export, _context) {
    "use strict";

    var PasswordCredential;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [],
        execute: function () {
            _export("PasswordCredential", PasswordCredential = function () {
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
            }());

            _export("PasswordCredential", PasswordCredential);
        }
    };
});