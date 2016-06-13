define(["exports", "aurelia-property-injection", "aurelia-event-aggregator", "aurelia-http-client", "aurelia-path", "aurelia-router", "aurelia-i18n", "./authorize-request", "./implicit-credential", "./password-credential", "./provider-credential", "./token-credential", "./implicit-authenticator", "./basic-authenticator", "./bearer-authenticator", "http-utils", "aurelia-storage"], function (exports, _aureliaPropertyInjection, _aureliaEventAggregator, _aureliaHttpClient, _aureliaPath, _aureliaRouter, _aureliaI18n, _authorizeRequest, _implicitCredential, _passwordCredential, _providerCredential, _tokenCredential, _implicitAuthenticator, _basicAuthenticator, _bearerAuthenticator, _httpUtils, _aureliaStorage) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.SecurityContextConfiguration = exports.SecurityContext = undefined;

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

    var SecurityContext_1 = function () {
        function SecurityContext(eventAggregator, api, router, i18n, storage) {
            var _this = this;

            _classCallCheck(this, SecurityContext);

            this.eventAggregator = eventAggregator;
            this.router = router;
            this.i18n = i18n;
            this.storage = storage;
            this.configuration = new SecurityContextConfiguration();
            this.api = api;
            this.api.configure(function (http) {
                http.withCredentials(true);
                http.withInterceptor(new _authorizeRequest.AuthorizeRequest(_this));
            });
        }

        SecurityContext.prototype.configure = function configure(configuration) {
            Object.assign(this.configuration, configuration);
        };

        SecurityContext.prototype.refreshRouteVisibility = function refreshRouteVisibility(router) {
            var _this2 = this;

            router.navigation.forEach(function (nav) {
                if (nav.settings.hideToUnauthorized) {
                    nav.settings.hide = Array.isArray(nav.settings.roles) ? !nav.settings.roles.some(function (r) {
                        return _this2.isUserInRole(r);
                    }) : nav.settings.requireAuthentication && _this2.userPrincipal != null;
                }
            });
        };

        SecurityContext.prototype.authenticate = function authenticate(credential) {
            var _this3 = this;

            var remember = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

            if (credential instanceof _implicitCredential.ImplicitCredential) {
                this.authenticator = new _implicitAuthenticator.ImplicitAuthenticator();
            } else if (credential instanceof _passwordCredential.PasswordCredential) {
                this.authenticator = new _basicAuthenticator.BasicAuthenticator(credential);
            } else if (credential instanceof _providerCredential.ProviderCredential) {} else if (credential instanceof _tokenCredential.TokenCredential) {
                this.authenticator = new _bearerAuthenticator.BearerAuthenticator(credential);
            }
            return this.api.get(this.configuration.getPrincipalUrl).then(function (success) {
                if (remember) {
                    _this3.requestAccessToken(_this3.configuration.scope).then(function (accessToken) {
                        return _this3.storage.set(_this3.configuration.authorizationTokenStorageKey, accessToken);
                    });
                }
                _this3.userPrincipal = success.content;
                _this3.eventAggregator.publish(SecurityContext_1.AUTHENTICATED_EVENT, _this3);
                _this3.refreshRouteVisibility(_this3.router);
                return _this3.userPrincipal;
            }, function (failure) {
                _this3.authenticator = new _implicitAuthenticator.ImplicitAuthenticator();
                throw failure;
            });
        };

        SecurityContext.prototype.deauthenticate = function deauthenticate() {
            var navigateToSignOutRoute = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

            this.eventAggregator.publish(SecurityContext_1.UNAUTHENTICATED_EVENT, this);
            this.userPrincipal = null;
            this.deleteAndRevokeToken();
            this.refreshRouteVisibility(this.router);
            if (navigateToSignOutRoute) {
                this.router.navigateToRoute(this.configuration.signOutRoute, {
                    message: this.i18n.tr("aurelia:security.signout", {
                        defaultValue: "You have successfully logged out."
                    }),
                    path: this.router.currentInstruction.fragment
                });
            }
        };

        SecurityContext.prototype.requestAccessToken = function requestAccessToken() {
            for (var _len = arguments.length, scopes = Array(_len), _key = 0; _key < _len; _key++) {
                scopes[_key] = arguments[_key];
            }

            return this.api.createRequest(this.configuration.accessRequestUrl).asGet().withParams({
                "client_id": this.configuration.clientId,
                "response_type": "token",
                "redirect_uri": "test",
                "scope": scopes.join(",")
            }).send().then(function (success) {
                return success.content;
            });
        };

        SecurityContext.prototype.deleteAndRevokeToken = function deleteAndRevokeToken() {
            var _this4 = this;

            this.authenticator = new _implicitAuthenticator.ImplicitAuthenticator();
            return this.storage.remove(this.configuration.authorizationTokenStorageKey).then(function (token) {
                return _this4.api.createRequest(_this4.configuration.accessRevokeUrl).asPost().withHeader(_httpUtils.HttpHeaders.CONTENT_TYPE, _httpUtils.MediaType.APPLICATION_FORM_URLENCODED).withContent((0, _aureliaPath.buildQueryString)({
                    token: token
                })).send();
            });
        };

        SecurityContext.prototype.requestPasswordReset = function requestPasswordReset(principal) {
            return this.api.createRequest(this.configuration.passwordResetUrl).asGet().withParams({
                "client_id": this.configuration.clientId,
                "principal": principal
            }).send();
        };

        SecurityContext.prototype.resetPassword = function resetPassword(token, password) {
            return this.api.createRequest(this.configuration.passwordResetUrl).asPut().withHeader(_httpUtils.HttpHeaders.AUTHORIZATION, "Bearer " + token).withHeader(_httpUtils.HttpHeaders.CONTENT_TYPE, _httpUtils.MediaType.TEXT_PLAIN).withContent(password).send();
        };

        SecurityContext.prototype.navigateToSignIn = function navigateToSignIn(message) {
            return this.router.navigateToRoute(this.configuration.signInRoute, {
                path: this.router.currentInstruction.fragment,
                message: message
            });
        };

        SecurityContext.prototype.navigateToSignUp = function navigateToSignUp() {
            return this.router.navigateToRoute(this.configuration.signUpRoute);
        };

        SecurityContext.prototype.navigateToSignOut = function navigateToSignOut() {
            return this.router.navigateToRoute(this.configuration.signOutRoute);
        };

        SecurityContext.prototype.getAuthenticator = function getAuthenticator() {
            return this.authenticator;
        };

        SecurityContext.prototype.getAuthenticationScheme = function getAuthenticationScheme() {
            return this.authenticator.getScheme();
        };

        SecurityContext.prototype.getUserPrincipal = function getUserPrincipal() {
            return this.userPrincipal;
        };

        SecurityContext.prototype.isUserInRole = function isUserInRole() {
            for (var _len2 = arguments.length, roleNames = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                roleNames[_key2] = arguments[_key2];
            }

            if (this.userPrincipal) {
                return this.userPrincipal.roles.some(function (role) {
                    return roleNames.indexOf(role.name) >= 0;
                });
            } else {
                return false;
            }
        };

        SecurityContext.prototype.isSecure = function isSecure() {
            return window.location.protocol.startsWith("https");
        };

        SecurityContext.prototype.getCurrentTenant = function getCurrentTenant() {
            return this.currentTenant ? this.currentTenant : {
                id: this.configuration.defaultTenantId,
                name: null
            };
        };

        SecurityContext.prototype.switchTenant = function switchTenant(tenant) {
            this.currentTenant = tenant;
        };

        return SecurityContext;
    }();
    var SecurityContext = exports.SecurityContext = SecurityContext_1;
    SecurityContext.AUTHENTICATED_EVENT = "aurelia.security.authenticated";
    SecurityContext.UNAUTHENTICATED_EVENT = "aurelia.security.unauthenticated";
    SecurityContext.TENANT_ID_HEADER = "X-Tenant-ID";
    exports.SecurityContext = SecurityContext = SecurityContext_1 = __decorate([_aureliaPropertyInjection.autoinject, __metadata('design:paramtypes', [typeof (_a = typeof _aureliaEventAggregator.EventAggregator !== 'undefined' && _aureliaEventAggregator.EventAggregator) === 'function' && _a || Object, typeof (_b = typeof _aureliaHttpClient.HttpClient !== 'undefined' && _aureliaHttpClient.HttpClient) === 'function' && _b || Object, typeof (_c = typeof _aureliaRouter.Router !== 'undefined' && _aureliaRouter.Router) === 'function' && _c || Object, typeof (_d = typeof _aureliaI18n.I18N !== 'undefined' && _aureliaI18n.I18N) === 'function' && _d || Object, _aureliaStorage.LocalStorage])], SecurityContext);

    var SecurityContextConfiguration = exports.SecurityContextConfiguration = function SecurityContextConfiguration() {
        _classCallCheck(this, SecurityContextConfiguration);

        this.signInRoute = "sign-in";
        this.signUpRoute = "sign-up";
        this.signOutRoute = "sign-in";
        this.forbiddenRoute = "forbidden";
        this.getPrincipalUrl = "me";
        this.accessRequestUrl = "/request";
        this.accessRevokeUrl = "/revoke";
        this.accessTokenUrl = "/token";
        this.passwordResetUrl = "/password-reset";
        this.authorizationTokenStorageKey = "aurelia.security.authorization.token";
    };

    var _a, _b, _c, _d;
});