import { inject, Optional} from "aurelia-dependency-injection";
import { EventAggregator} from "aurelia-event-aggregator";
import { HttpClient, HttpResponseMessage} from "aurelia-http-client";
import { buildQueryString} from "aurelia-path";
import { Router, NavModel} from "aurelia-router";
import { AuthorizeRequest} from "./authorize-request";
import { Credential} from "./credential";
import { ImplicitCredential} from "./implicit-credential";
import { PasswordCredential} from "./password-credential";
import { ProviderCredential} from "./provider-credential";
import { TokenCredential} from "./token-credential";
import { Authenticator} from "./authenticator";
import { ImplicitAuthenticator} from "./implicit-authenticator";
import { BasicAuthenticator} from "./basic-authenticator";
import { BearerAuthenticator} from "./bearer-authenticator";
import { Principal} from "./principal";
import { SecurityRole} from "./security-role";
import { HttpHeaders, MediaType} from "aurelia-http-utils";
import { LocalStorage} from "aurelia-storage";
import { Tenant} from "./tenant";

@inject(EventAggregator, HttpClient, Router, LocalStorage)
export class SecurityContext {

    public static AUTHENTICATED_EVENT: string = "aurelia.security.authenticated";

    public static UNAUTHENTICATED_EVENT: string = "aurelia.security.unauthenticated";

    public static TENANT_ID_HEADER: string = "X-Tenant-ID";

    public configuration: SecurityContextConfiguration;

    public eventAggregator: EventAggregator;

    private api: HttpClient;

    private router: Router;

    private authenticator: Authenticator;

    private userPrincipal: Principal;

    private storage: LocalStorage;

    private currentTenant: Tenant;

    public constructor(eventAggregator: EventAggregator, api: HttpClient, router: Router, storage: LocalStorage) {
        this.eventAggregator = eventAggregator;
        this.router = router;
        this.storage = storage;
        this.configuration = new SecurityContextConfiguration();
        this.api = api;
        this.api.configure(http => {
            http.withCredentials(true);
            http.withInterceptor(new AuthorizeRequest(this));
        });
    }

    public configure(configuration: Object): void {
        Object.assign(this.configuration, configuration);
    }

    public refreshRouteVisibility(router: Router): void {
        router.navigation.forEach(nav => {
            if (nav.settings.hideToUnauthorized) {
                nav.settings.hide = Array.isArray(nav.settings.roles)
                ? !nav.settings.roles.some(r => this.isUserInRole(r))
                : (nav.settings.requireAuthentication && this.userPrincipal != null)
            }
        });
    }

    public authenticate(credential: Credential, remember: boolean = false): Promise<Principal> {
        if (credential instanceof ImplicitCredential) {
            this.authenticator = new ImplicitAuthenticator();
        } else if (credential instanceof PasswordCredential) {
            this.authenticator = new BasicAuthenticator(credential);
        } else if (credential instanceof ProviderCredential) {
            // TODO
        } else if (credential instanceof TokenCredential) {
            this.authenticator = new BearerAuthenticator(credential);
        }
        return this.api.get(this.configuration.getPrincipalUrl).then(success => {
            if (remember) {
                this.requestAccessToken(this.configuration.scope)
                .then(accessToken => this.storage.set(this.configuration.authorizationTokenStorageKey, accessToken))
            }
            this.userPrincipal = <Principal> success.content;
            this.eventAggregator.publish(SecurityContext.AUTHENTICATED_EVENT, this);
            this.refreshRouteVisibility(this.router);
            return this.userPrincipal;
        }, failure => {
            this.authenticator = new ImplicitAuthenticator();
            throw failure;
        });
    }

    public deauthenticate(navigateToSignOutRoute: boolean = true): void {
        this.eventAggregator.publish(SecurityContext.UNAUTHENTICATED_EVENT, this);
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
    }

    public requestAccessToken(...scopes: string[]): Promise<string> {
        return this.api.createRequest(this.configuration.accessRequestUrl).asGet()
        .withParams({
            "client_id": this.configuration.clientId,
            "response_type": "token",
            "redirect_uri": "test",
            "scope": scopes.join(",")
        }).send().then(success => success.content);
    }

    public deleteAndRevokeToken(): Promise<any> {
        this.authenticator = new ImplicitAuthenticator();
        return this.storage.remove(this.configuration.authorizationTokenStorageKey).then(token => {
            return this.api.createRequest(this.configuration.accessRevokeUrl).asPost()
            .withHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED)
            .withContent(buildQueryString({
                token: token
            })).send();
        });
    }

    public requestPasswordReset(principal: string): Promise<HttpResponseMessage> {
        return this.api.createRequest(this.configuration.passwordResetUrl).asGet()
        .withParams({
            "client_id": this.configuration.clientId,
            "principal": principal
        }).send();
    }

    public resetPassword(token: string, password: string): Promise<HttpResponseMessage> {
        return this.api.createRequest(this.configuration.passwordResetUrl).asPut()
        .withHeader(HttpHeaders.AUTHORIZATION, `Bearer ${token}`)
        .withHeader(HttpHeaders.CONTENT_TYPE, MediaType.TEXT_PLAIN)
        .withContent(password)
        .send();
    }

    public navigateToSignIn(message?: string): boolean {
        return this.router.navigateToRoute(this.configuration.signInRoute, {
            path: this.router.currentInstruction.fragment,
            message: message
        });
    }

    public navigateToSignUp(): boolean {
        return this.router.navigateToRoute(this.configuration.signUpRoute);
    }

    public navigateToSignOut(): boolean {
        return this.router.navigateToRoute(this.configuration.signOutRoute);
    }

    public getAuthenticator(): Authenticator {
        return this.authenticator;
    }

    public getAuthenticationScheme(): string {
        return this.authenticator.getScheme();
    }

    public getUserPrincipal(): Principal {
        return this.userPrincipal;
    }

    public isUserInRole(...roleNames: string[]): boolean {
        if (this.userPrincipal) {
            return this.userPrincipal.roles.some(role => roleNames.indexOf(role.name) >= 0);
        } else {
            return false;
        }
    }

    public isSecure(): boolean {
        return window.location.protocol.startsWith("https");
    }

    public getCurrentTenant(): Tenant {
        return this.currentTenant ? this.currentTenant : {
            id: this.configuration.defaultTenantId,
            name: null
        };
    }

    public switchTenant(tenant: Tenant) {
        this.currentTenant = tenant;
    }

}

export class SecurityContextConfiguration {

    public signInRoute: string = "sign-in";

    public signUpRoute: string = "sign-up";

    public signOutRoute: string = "sign-in";

    public forbiddenRoute: string = "forbidden";

    public getPrincipalUrl: string = "me";

    public accessRequestUrl: string = "/request";

    public accessRevokeUrl: string = "/revoke";

    public accessTokenUrl: string = "/token";

    public passwordResetUrl: string = "/password-reset";

    public clientId: string;

    public scope: string;

    public defaultTenantId: string;

    public authorizationTokenStorageKey: string = "aurelia.security.authorization.token";

}
