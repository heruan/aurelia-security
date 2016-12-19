"use strict";
var OAuth2 = (function () {
    function OAuth2(name, title, applicationId, configuration) {
        this.name = name;
        this.title = title;
        this.applicationId = applicationId;
        this.configuration = configuration;
    }
    OAuth2.prototype.requestAuthorization = function () {
        var scope = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            scope[_i] = arguments[_i];
        }
        var redirectUri = window.location.origin + window.location.pathname + ("?provider=" + this.name);
        var url = this.configuration.authorizationRequestUrl + "?"
            + this.configuration.redirectUriParamName + "=" + encodeURIComponent(redirectUri) + "&"
            + this.configuration.applicationIdParamName + "=" + this.applicationId + "&"
            + this.configuration.scopeParamName + "=" + scope.join(",") + "&"
            + this.configuration.stateParamName + "=" + this.generateState();
        window.location.href = url;
    };
    OAuth2.prototype.generateState = function () {
        return window.crypto.getRandomValues(new Uint32Array(1))[0];
    };
    return OAuth2;
}());
exports.OAuth2 = OAuth2;
var OAuth2Configuration = (function () {
    function OAuth2Configuration(configuration) {
        this.applicationIdParamName = "client_id";
        this.redirectUriParamName = "redirect_uri";
        this.scopeParamName = "scope";
        this.stateParamName = "state";
        Object.assign(this, configuration);
    }
    return OAuth2Configuration;
}());
exports.OAuth2Configuration = OAuth2Configuration;

//# sourceMappingURL=oauth2.js.map
