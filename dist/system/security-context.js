"use strict";

System.register(["aurelia-property-injection", "aurelia-event-aggregator", "aurelia-http-client", "aurelia-path", "aurelia-router", "aurelia-i18n", "./authorize-request", "./implicit-credential", "./password-credential", "./provider-credential", "./token-credential", "./implicit-authenticator", "./basic-authenticator", "./bearer-authenticator", "http-utils", "aurelia-storage"], function (_export, _context) {
    "use strict";

    var autoinject, EventAggregator, HttpClient, buildQueryString, Router, I18N, AuthorizeRequest, ImplicitCredential, PasswordCredential, ProviderCredential, TokenCredential, ImplicitAuthenticator, BasicAuthenticator, BearerAuthenticator, HttpHeaders, MediaType, LocalStorage, _typeof, __decorate, __metadata, SecurityContext_1, SecurityContext, SecurityContextConfiguration, _a, _b, _c, _d;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_aureliaPropertyInjection) {
            autoinject = _aureliaPropertyInjection.autoinject;
        }, function (_aureliaEventAggregator) {
            EventAggregator = _aureliaEventAggregator.EventAggregator;
        }, function (_aureliaHttpClient) {
            HttpClient = _aureliaHttpClient.HttpClient;
        }, function (_aureliaPath) {
            buildQueryString = _aureliaPath.buildQueryString;
        }, function (_aureliaRouter) {
            Router = _aureliaRouter.Router;
        }, function (_aureliaI18n) {
            I18N = _aureliaI18n.I18N;
        }, function (_authorizeRequest) {
            AuthorizeRequest = _authorizeRequest.AuthorizeRequest;
        }, function (_implicitCredential) {
            ImplicitCredential = _implicitCredential.ImplicitCredential;
        }, function (_passwordCredential) {
            PasswordCredential = _passwordCredential.PasswordCredential;
        }, function (_providerCredential) {
            ProviderCredential = _providerCredential.ProviderCredential;
        }, function (_tokenCredential) {
            TokenCredential = _tokenCredential.TokenCredential;
        }, function (_implicitAuthenticator) {
            ImplicitAuthenticator = _implicitAuthenticator.ImplicitAuthenticator;
        }, function (_basicAuthenticator) {
            BasicAuthenticator = _basicAuthenticator.BasicAuthenticator;
        }, function (_bearerAuthenticator) {
            BearerAuthenticator = _bearerAuthenticator.BearerAuthenticator;
        }, function (_httpUtils) {
            HttpHeaders = _httpUtils.HttpHeaders;
            MediaType = _httpUtils.MediaType;
        }, function (_aureliaStorage) {
            LocalStorage = _aureliaStorage.LocalStorage;
        }],
        execute: function () {
            _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
                return typeof obj;
            } : function (obj) {
                return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
            };

            __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
                var c = arguments.length,
                    r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
                    d;
                if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
                    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
                }return c > 3 && r && Object.defineProperty(target, key, r), r;
            };

            __metadata = undefined && undefined.__metadata || function (k, v) {
                if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
            };

            SecurityContext_1 = function () {
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
                        http.withInterceptor(new AuthorizeRequest(_this));
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

                    if (credential instanceof ImplicitCredential) {
                        this.authenticator = new ImplicitAuthenticator();
                    } else if (credential instanceof PasswordCredential) {
                        this.authenticator = new BasicAuthenticator(credential);
                    } else if (credential instanceof ProviderCredential) {} else if (credential instanceof TokenCredential) {
                        this.authenticator = new BearerAuthenticator(credential);
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
                        _this3.authenticator = new ImplicitAuthenticator();
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

                    this.authenticator = new ImplicitAuthenticator();
                    return this.storage.remove(this.configuration.authorizationTokenStorageKey).then(function (token) {
                        return _this4.api.createRequest(_this4.configuration.accessRevokeUrl).asPost().withHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED).withContent(buildQueryString({
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
                    return this.api.createRequest(this.configuration.passwordResetUrl).asPut().withHeader(HttpHeaders.AUTHORIZATION, "Bearer " + token).withHeader(HttpHeaders.CONTENT_TYPE, MediaType.TEXT_PLAIN).withContent(password).send();
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

            _export("SecurityContext", SecurityContext = SecurityContext_1);

            _export("SecurityContext", SecurityContext);

            SecurityContext.AUTHENTICATED_EVENT = "aurelia.security.authenticated";
            SecurityContext.UNAUTHENTICATED_EVENT = "aurelia.security.unauthenticated";
            SecurityContext.TENANT_ID_HEADER = "X-Tenant-ID";
            _export("SecurityContext", SecurityContext = SecurityContext_1 = __decorate([autoinject, __metadata('design:paramtypes', [typeof (_a = typeof EventAggregator !== 'undefined' && EventAggregator) === 'function' && _a || Object, typeof (_b = typeof HttpClient !== 'undefined' && HttpClient) === 'function' && _b || Object, typeof (_c = typeof Router !== 'undefined' && Router) === 'function' && _c || Object, typeof (_d = typeof I18N !== 'undefined' && I18N) === 'function' && _d || Object, LocalStorage])], SecurityContext));

            _export("SecurityContextConfiguration", SecurityContextConfiguration = function SecurityContextConfiguration() {
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
            });

            _export("SecurityContextConfiguration", SecurityContextConfiguration);
        }
    };
});