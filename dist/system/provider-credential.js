"use strict";

System.register([], function (_export, _context) {
    "use strict";

    var ProviderCredential;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [],
        execute: function () {
            _export("ProviderCredential", ProviderCredential = function () {
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
            }());

            _export("ProviderCredential", ProviderCredential);
        }
    };
});