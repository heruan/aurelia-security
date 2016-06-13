define(["exports", "./oauth2"], function (exports, _oauth) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Facebook = undefined;

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

    var Facebook = exports.Facebook = function (_OAuth) {
        _inherits(Facebook, _OAuth);

        function Facebook(applicationId) {
            _classCallCheck(this, Facebook);

            return _possibleConstructorReturn(this, _OAuth.call(this, "facebook", "Facebook", applicationId, new _oauth.OAuth2Configuration({
                authorizationRequestUrl: "https://www.facebook.com/dialog/oauth"
            })));
        }

        return Facebook;
    }(_oauth.OAuth2);
});