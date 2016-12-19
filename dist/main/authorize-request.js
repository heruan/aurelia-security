"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var aurelia_dependency_injection_1 = require("aurelia-dependency-injection");
var aurelia_http_utils_1 = require("aurelia-http-utils");
var security_context_1 = require("./security-context");
var AuthorizeRequest = (function () {
    function AuthorizeRequest(securityContext) {
        this.securityContext = securityContext;
    }
    AuthorizeRequest.prototype.request = function (message) {
        var tenant = this.securityContext.getCurrentTenant();
        if (tenant) {
            message.headers.add(security_context_1.SecurityContext.TENANT_ID_HEADER, tenant.id);
        }
        if (!message.headers.has(aurelia_http_utils_1.HttpHeaders.AUTHORIZATION)) {
            return this.securityContext.getAuthenticator().authorizeMessage(message);
        }
        return message;
    };
    AuthorizeRequest.prototype.responseError = function (message) {
        switch (message.statusCode) {
            case 401:
                if (message.headers.has(aurelia_http_utils_1.HttpHeaders.WWW_AUTHENTICATE)) {
                    var authenticateHeader = message.headers.get(aurelia_http_utils_1.HttpHeaders.WWW_AUTHENTICATE);
                    var authenticateHeaderPattern = /(\w+)\s+(.+)/;
                    var authenticateHeaderMatcher = authenticateHeaderPattern.exec(authenticateHeader);
                    var authenticationScheme = authenticateHeaderMatcher[1].toUpperCase();
                    var authenticationData = authenticateHeaderMatcher[2];
                    switch (authenticationScheme) {
                        case "BEARER":
                            var bearerDataPattern = /realm="([^"]+)",\s+error="([^"]+)",\s+error_description="([^"]+)"/;
                            var bearerDataMatcher = bearerDataPattern.exec(authenticationData);
                            var realm = bearerDataMatcher[1];
                            var error = bearerDataMatcher[2];
                            var errorDescription = bearerDataMatcher[3];
                            switch (error) {
                                case "invalid_request":
                                    // Only with 400 Bad Request
                                    break;
                                case "invalid_token":
                                    this.securityContext.deauthenticate(false);
                                    break;
                                case "insufficient_scope":
                                    // Only with 403 Frobidden
                                    break;
                            }
                            this.securityContext.navigateToSignIn(errorDescription);
                            throw message;
                    }
                }
                break;
        }
        throw message;
    };
    return AuthorizeRequest;
}());
AuthorizeRequest = __decorate([
    aurelia_dependency_injection_1.autoinject,
    __metadata("design:paramtypes", [security_context_1.SecurityContext])
], AuthorizeRequest);
exports.AuthorizeRequest = AuthorizeRequest;

//# sourceMappingURL=authorize-request.js.map
