var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { autoinject } from "aurelia-property-injection";
import { EventAggregator } from "aurelia-event-aggregator";
import { HttpClient } from "aurelia-http-client";
import { buildQueryString } from "aurelia-path";
import { Router } from "aurelia-router";
import { I18N } from "aurelia-i18n";
import { AuthorizeRequest } from "./authorize-request";
import { ImplicitCredential } from "./implicit-credential";
import { PasswordCredential } from "./password-credential";
import { ProviderCredential } from "./provider-credential";
import { TokenCredential } from "./token-credential";
import { ImplicitAuthenticator } from "./implicit-authenticator";
import { BasicAuthenticator } from "./basic-authenticator";
import { BearerAuthenticator } from "./bearer-authenticator";
import { HttpHeaders, MediaType } from "http-utils";
import { LocalStorage } from "aurelia-storage";
let SecurityContext_1 = class SecurityContext {
    constructor(eventAggregator, api, router, i18n, storage) {
        this.eventAggregator = eventAggregator;
        this.router = router;
        this.i18n = i18n;
        this.storage = storage;
        this.configuration = new SecurityContextConfiguration();
        this.api = api;
        this.api.configure(http => {
            http.withCredentials(true);
            http.withInterceptor(new AuthorizeRequest(this));
        });
    }
    configure(configuration) {
        Object.assign(this.configuration, configuration);
    }
    refreshRouteVisibility(router) {
        router.navigation.forEach(nav => {
            if (nav.settings.hideToUnauthorized) {
                nav.settings.hide = Array.isArray(nav.settings.roles)
                    ? !nav.settings.roles.some(r => this.isUserInRole(r))
                    : (nav.settings.requireAuthentication && this.userPrincipal != null);
            }
        });
    }
    authenticate(credential, remember = false) {
        if (credential instanceof ImplicitCredential) {
            this.authenticator = new ImplicitAuthenticator();
        }
        else if (credential instanceof PasswordCredential) {
            this.authenticator = new BasicAuthenticator(credential);
        }
        else if (credential instanceof ProviderCredential) {
        }
        else if (credential instanceof TokenCredential) {
            this.authenticator = new BearerAuthenticator(credential);
        }
        return this.api.get(this.configuration.getPrincipalUrl).then(success => {
            if (remember) {
                this.requestAccessToken(this.configuration.scope)
                    .then(accessToken => this.storage.set(this.configuration.authorizationTokenStorageKey, accessToken));
            }
            this.userPrincipal = success.content;
            this.eventAggregator.publish(SecurityContext_1.AUTHENTICATED_EVENT, this);
            this.refreshRouteVisibility(this.router);
            return this.userPrincipal;
        }, failure => {
            this.authenticator = new ImplicitAuthenticator();
            throw failure;
        });
    }
    deauthenticate(navigateToSignOutRoute = true) {
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
    }
    requestAccessToken(...scopes) {
        return this.api.createRequest(this.configuration.accessRequestUrl).asGet()
            .withParams({
            "client_id": this.configuration.clientId,
            "response_type": "token",
            "redirect_uri": "test",
            "scope": scopes.join(",")
        }).send().then(success => success.content);
    }
    deleteAndRevokeToken() {
        this.authenticator = new ImplicitAuthenticator();
        return this.storage.remove(this.configuration.authorizationTokenStorageKey).then(token => {
            return this.api.createRequest(this.configuration.accessRevokeUrl).asPost()
                .withHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED)
                .withContent(buildQueryString({
                token: token
            })).send();
        });
    }
    requestPasswordReset(principal) {
        return this.api.createRequest(this.configuration.passwordResetUrl).asGet()
            .withParams({
            "client_id": this.configuration.clientId,
            "principal": principal
        }).send();
    }
    resetPassword(token, password) {
        return this.api.createRequest(this.configuration.passwordResetUrl).asPut()
            .withHeader(HttpHeaders.AUTHORIZATION, `Bearer ${token}`)
            .withHeader(HttpHeaders.CONTENT_TYPE, MediaType.TEXT_PLAIN)
            .withContent(password)
            .send();
    }
    navigateToSignIn(message) {
        return this.router.navigateToRoute(this.configuration.signInRoute, {
            path: this.router.currentInstruction.fragment,
            message: message
        });
    }
    navigateToSignUp() {
        return this.router.navigateToRoute(this.configuration.signUpRoute);
    }
    navigateToSignOut() {
        return this.router.navigateToRoute(this.configuration.signOutRoute);
    }
    getAuthenticator() {
        return this.authenticator;
    }
    getAuthenticationScheme() {
        return this.authenticator.getScheme();
    }
    getUserPrincipal() {
        return this.userPrincipal;
    }
    isUserInRole(...roleNames) {
        if (this.userPrincipal) {
            return this.userPrincipal.roles.some(role => roleNames.indexOf(role.name) >= 0);
        }
        else {
            return false;
        }
    }
    isSecure() {
        return window.location.protocol.startsWith("https");
    }
    getCurrentTenant() {
        return this.currentTenant ? this.currentTenant : {
            id: this.configuration.defaultTenantId,
            name: null
        };
    }
    switchTenant(tenant) {
        this.currentTenant = tenant;
    }
};
export let SecurityContext = SecurityContext_1;
SecurityContext.AUTHENTICATED_EVENT = "aurelia.security.authenticated";
SecurityContext.UNAUTHENTICATED_EVENT = "aurelia.security.unauthenticated";
SecurityContext.TENANT_ID_HEADER = "X-Tenant-ID";
SecurityContext = SecurityContext_1 = __decorate([
    autoinject, 
    __metadata('design:paramtypes', [(typeof (_a = typeof EventAggregator !== 'undefined' && EventAggregator) === 'function' && _a) || Object, (typeof (_b = typeof HttpClient !== 'undefined' && HttpClient) === 'function' && _b) || Object, (typeof (_c = typeof Router !== 'undefined' && Router) === 'function' && _c) || Object, (typeof (_d = typeof I18N !== 'undefined' && I18N) === 'function' && _d) || Object, LocalStorage])
], SecurityContext);
export class SecurityContextConfiguration {
    constructor() {
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
    }
}
var _a, _b, _c, _d;
//# sourceMappingURL=security-context.js.map