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
var aurelia_event_aggregator_1 = require("aurelia-event-aggregator");
var aurelia_http_client_1 = require("aurelia-http-client");
var aurelia_path_1 = require("aurelia-path");
var aurelia_router_1 = require("aurelia-router");
var type_binder_1 = require("type-binder");
var authorize_request_1 = require("./authorize-request");
var implicit_credential_1 = require("./implicit-credential");
var password_credential_1 = require("./password-credential");
var provider_credential_1 = require("./provider-credential");
var token_credential_1 = require("./token-credential");
var implicit_authenticator_1 = require("./implicit-authenticator");
var basic_authenticator_1 = require("./basic-authenticator");
var bearer_authenticator_1 = require("./bearer-authenticator");
var aurelia_http_utils_1 = require("aurelia-http-utils");
var aurelia_storage_1 = require("aurelia-storage");
var SecurityContext = SecurityContext_1 = (function () {
    function SecurityContext(eventAggregator, api, router, storage, typeBinder) {
        var _this = this;
        this.eventAggregator = eventAggregator;
        this.router = router;
        this.storage = storage;
        this.typeBinder = typeBinder;
        this.configuration = new SecurityContextConfiguration();
        this.api = api;
        this.api.configure(function (http) {
            http.withCredentials(true);
            http.withInterceptor(new authorize_request_1.AuthorizeRequest(_this));
        });
    }
    SecurityContext.prototype.configure = function (configuration) {
        Object.assign(this.configuration, configuration);
    };
    SecurityContext.prototype.refreshRouteVisibility = function (router) {
        var _this = this;
        router.navigation.forEach(function (nav) {
            if (nav.settings.hideToUnauthorized) {
                nav.settings.hide = Array.isArray(nav.settings.roles)
                    ? !nav.settings.roles.some(function (r) { return _this.isUserInRole(r); })
                    : (nav.settings.requireAuthentication && _this.userPrincipal != null);
            }
        });
    };
    SecurityContext.prototype.authenticate = function (credential, remember) {
        var _this = this;
        if (remember === void 0) { remember = false; }
        if (credential instanceof implicit_credential_1.ImplicitCredential) {
            this.authenticator = new implicit_authenticator_1.ImplicitAuthenticator();
        }
        else if (credential instanceof password_credential_1.PasswordCredential) {
            this.authenticator = new basic_authenticator_1.BasicAuthenticator(credential);
        }
        else if (credential instanceof provider_credential_1.ProviderCredential) {
        }
        else if (credential instanceof token_credential_1.TokenCredential) {
            this.authenticator = new bearer_authenticator_1.BearerAuthenticator(credential);
        }
        return this.api.get(this.configuration.getPrincipalUrl).then(function (success) {
            if (remember) {
                _this.requestAccessToken(_this.configuration.scope)
                    .then(function (accessToken) { return _this.storage.set(_this.configuration.authorizationTokenStorageKey, accessToken); });
            }
            _this.userPrincipal = _this.typeBinder.bind(success.content, _this.configuration.userPrincipalType);
            _this.eventAggregator.publish(SecurityContext_1.AUTHENTICATED_EVENT, _this);
            _this.refreshRouteVisibility(_this.router);
            return _this.userPrincipal;
        }, function (failure) {
            _this.authenticator = new implicit_authenticator_1.ImplicitAuthenticator();
            throw failure;
        });
    };
    SecurityContext.prototype.deauthenticate = function (navigateToSignOutRoute) {
        if (navigateToSignOutRoute === void 0) { navigateToSignOutRoute = true; }
        this.eventAggregator.publish(SecurityContext_1.UNAUTHENTICATED_EVENT, this);
        this.userPrincipal = null;
        this.deleteAndRevokeToken();
        this.refreshRouteVisibility(this.router);
        if (navigateToSignOutRoute) {
            this.router.navigateToRoute(this.configuration.signOutRoute, {
                // message: this.i18n.tr("aurelia:security.signout", {
                //     defaultValue: "You have successfully logged out."
                // }),
                message: "You have successfully logged out.",
                path: this.router.currentInstruction.fragment
            });
        }
    };
    SecurityContext.prototype.requestAccessToken = function () {
        var scopes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            scopes[_i] = arguments[_i];
        }
        return this.api.createRequest(this.configuration.accessRequestUrl).asGet()
            .withParams({
            "client_id": this.configuration.clientId,
            "response_type": "token",
            "redirect_uri": "test",
            "scope": scopes.join(",")
        }).send().then(function (success) { return success.content; });
    };
    SecurityContext.prototype.deleteAndRevokeToken = function () {
        var _this = this;
        return this.storage.get(this.configuration.authorizationTokenStorageKey).then(function (token) { return Promise.all([
            _this.storage.remove(_this.configuration.authorizationTokenStorageKey),
            _this.api.createRequest(_this.configuration.accessRevokeUrl).asPost()
                .withHeader(aurelia_http_utils_1.HttpHeaders.CONTENT_TYPE, aurelia_http_utils_1.MediaType.APPLICATION_FORM_URLENCODED)
                .withContent(aurelia_path_1.buildQueryString({ token: token })).send()
        ]); }).then(function (all) { return _this.authenticator = new implicit_authenticator_1.ImplicitAuthenticator(); });
    };
    SecurityContext.prototype.requestPasswordReset = function (principal) {
        return this.api.createRequest(this.configuration.passwordResetUrl).asGet()
            .withParams({
            "client_id": this.configuration.clientId,
            "principal": principal
        }).send();
    };
    SecurityContext.prototype.resetPassword = function (token, password) {
        return this.api.createRequest(this.configuration.passwordResetUrl).asPut()
            .withHeader(aurelia_http_utils_1.HttpHeaders.AUTHORIZATION, "Bearer " + token)
            .withHeader(aurelia_http_utils_1.HttpHeaders.CONTENT_TYPE, aurelia_http_utils_1.MediaType.TEXT_PLAIN)
            .withContent(password)
            .send();
    };
    SecurityContext.prototype.navigateToSignIn = function (message) {
        return this.router.navigateToRoute(this.configuration.signInRoute, {
            path: this.router.currentInstruction.fragment,
            message: message
        });
    };
    SecurityContext.prototype.navigateToSignUp = function () {
        return this.router.navigateToRoute(this.configuration.signUpRoute);
    };
    SecurityContext.prototype.navigateToSignOut = function () {
        return this.router.navigateToRoute(this.configuration.signOutRoute);
    };
    SecurityContext.prototype.getAuthenticator = function () {
        return this.authenticator;
    };
    SecurityContext.prototype.getAuthenticationScheme = function () {
        return this.authenticator.getScheme();
    };
    SecurityContext.prototype.getUserPrincipal = function () {
        return this.userPrincipal;
    };
    SecurityContext.prototype.isUserInRole = function () {
        var roleNames = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            roleNames[_i] = arguments[_i];
        }
        if (this.userPrincipal) {
            return this.userPrincipal.roles.some(function (role) { return roleNames.indexOf(role.name) >= 0; });
        }
        else {
            return false;
        }
    };
    SecurityContext.prototype.isSecure = function () {
        return window.location.protocol.startsWith("https");
    };
    SecurityContext.prototype.getCurrentTenant = function () {
        return this.currentTenant ? this.currentTenant : {
            id: this.configuration.defaultTenantId,
            name: null
        };
    };
    SecurityContext.prototype.switchTenant = function (tenant) {
        this.currentTenant = tenant;
    };
    return SecurityContext;
}());
SecurityContext.AUTHENTICATED_EVENT = "aurelia.security.authenticated";
SecurityContext.UNAUTHENTICATED_EVENT = "aurelia.security.unauthenticated";
SecurityContext.TENANT_ID_HEADER = "X-Tenant-ID";
SecurityContext = SecurityContext_1 = __decorate([
    aurelia_dependency_injection_1.inject(aurelia_event_aggregator_1.EventAggregator, aurelia_http_client_1.HttpClient, aurelia_router_1.Router, aurelia_storage_1.LocalStorage, type_binder_1.TypeBinder),
    __metadata("design:paramtypes", [aurelia_event_aggregator_1.EventAggregator, aurelia_http_client_1.HttpClient, aurelia_router_1.Router, aurelia_storage_1.LocalStorage, type_binder_1.TypeBinder])
], SecurityContext);
exports.SecurityContext = SecurityContext;
var SecurityContextConfiguration = (function () {
    function SecurityContextConfiguration() {
        this.signInRoute = "sign-in";
        this.signUpRoute = "sign-up";
        this.signOutRoute = "sign-in";
        this.forbiddenRoute = "forbidden";
        this.getPrincipalUrl = "/me";
        this.accessRequestUrl = "/request";
        this.accessRevokeUrl = "/revoke";
        this.accessTokenUrl = "/token";
        this.passwordResetUrl = "/password-reset";
        this.authorizationTokenStorageKey = "aurelia.security.authorization.token";
    }
    return SecurityContextConfiguration;
}());
exports.SecurityContextConfiguration = SecurityContextConfiguration;
var SecurityContext_1;

//# sourceMappingURL=security-context.js.map
