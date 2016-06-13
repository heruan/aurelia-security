"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OAuth2 = exports.OAuth2 = function () {
    function OAuth2(name, title, applicationId, configuration) {
        _classCallCheck(this, OAuth2);

        this.name = name;
        this.title = title;
        this.applicationId = applicationId;
        this.configuration = configuration;
    }

    OAuth2.prototype.requestAuthorization = function requestAuthorization() {
        var redirectUri = window.location.origin + window.location.pathname + ("?provider=" + this.name);

        for (var _len = arguments.length, scope = Array(_len), _key = 0; _key < _len; _key++) {
            scope[_key] = arguments[_key];
        }

        var url = this.configuration.authorizationRequestUrl + "?" + this.configuration.redirectUriParamName + "=" + encodeURIComponent(redirectUri) + "&" + this.configuration.applicationIdParamName + "=" + this.applicationId + "&" + this.configuration.scopeParamName + "=" + scope.join(",") + "&" + this.configuration.stateParamName + "=" + this.generateState();
        window.location.href = url;
    };

    OAuth2.prototype.generateState = function generateState() {
        return window.crypto.getRandomValues(new Uint32Array(1))[0];
    };

    return OAuth2;
}();

var OAuth2Configuration = exports.OAuth2Configuration = function OAuth2Configuration(configuration) {
    _classCallCheck(this, OAuth2Configuration);

    this.applicationIdParamName = "client_id";
    this.redirectUriParamName = "redirect_uri";
    this.scopeParamName = "scope";
    this.stateParamName = "state";
    Object.assign(this, configuration);
};