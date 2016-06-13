define(["exports", "aurelia-property-injection", "http-utils", "./security-context"], function (exports, _aureliaPropertyInjection, _httpUtils, _securityContext) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.AuthorizeRequest = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
    };

    var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
        var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
        if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
            if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        }return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = undefined && undefined.__metadata || function (k, v) {
        if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var AuthorizeRequest = exports.AuthorizeRequest = function () {
        function AuthorizeRequest(securityContext) {
            _classCallCheck(this, AuthorizeRequest);

            this.securityContext = securityContext;
        }

        AuthorizeRequest.prototype.request = function request(message) {
            var tenant = this.securityContext.getCurrentTenant();
            if (tenant) {
                message.headers.add(_securityContext.SecurityContext.TENANT_ID_HEADER, tenant.id);
            }
            if (!message.headers.has(_httpUtils.HttpHeaders.AUTHORIZATION)) {
                return this.securityContext.getAuthenticator().authorizeMessage(message);
            }
            return message;
        };

        AuthorizeRequest.prototype.responseError = function responseError(message) {
            switch (message.statusCode) {
                case 401:
                    if (message.headers.has(_httpUtils.HttpHeaders.WWW_AUTHENTICATE)) {
                        var authenticateHeader = message.headers.get(_httpUtils.HttpHeaders.WWW_AUTHENTICATE);
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
                                        break;
                                    case "invalid_token":
                                        this.securityContext.deauthenticate(false);
                                        break;
                                    case "insufficient_scope":
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
    }();
    exports.AuthorizeRequest = AuthorizeRequest = __decorate([_aureliaPropertyInjection.autoinject, __metadata('design:paramtypes', [_securityContext.SecurityContext])], AuthorizeRequest);
});