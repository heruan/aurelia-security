"use strict";

System.register(["./oauth2"], function (_export, _context) {
    "use strict";

    var OAuth2, OAuth2Configuration, Facebook;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    return {
        setters: [function (_oauth) {
            OAuth2 = _oauth.OAuth2;
            OAuth2Configuration = _oauth.OAuth2Configuration;
        }],
        execute: function () {
            _export("Facebook", Facebook = function (_OAuth) {
                _inherits(Facebook, _OAuth);

                function Facebook(applicationId) {
                    _classCallCheck(this, Facebook);

                    return _possibleConstructorReturn(this, _OAuth.call(this, "facebook", "Facebook", applicationId, new OAuth2Configuration({
                        authorizationRequestUrl: "https://www.facebook.com/dialog/oauth"
                    })));
                }

                return Facebook;
            }(OAuth2));

            _export("Facebook", Facebook);
        }
    };
});