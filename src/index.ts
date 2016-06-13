import {FrameworkConfiguration} from "aurelia-framework";
import {Container} from "aurelia-dependency-injection";
import {EventAggregator} from "aurelia-event-aggregator";
import {Router} from "aurelia-router";
import {HttpClient} from "aurelia-http-client";
import {I18N} from "aurelia-i18n";
import {SecurityContext} from "./security-context";
import {AuthorizeRequest} from "./authorize-request";
import {AuthorizeStep} from "./authorize-step";
import {Principal} from "./principal";
import {SecurityRole} from "./security-role";
import {Credential} from "./credential";
import {ImplicitCredential} from "./implicit-credential";
import {PasswordCredential} from "./password-credential";
import {ProviderCredential} from "./provider-credential";
import {TokenCredential} from "./token-credential";
import {LocalStorage} from "aurelia-storage";
import {Tenant} from "./tenant";

export function configure(frameworkConfiguration: FrameworkConfiguration, pluginConfiguration: Function) {
    let container: Container = frameworkConfiguration.container;
    let eventAggregator: EventAggregator = container.get(EventAggregator);
    let router: Router = container.get(Router);
    let httpClient: HttpClient = container.get(HttpClient);
    let i18n: I18N = container.get(I18N);
    let storage: LocalStorage = container.get(LocalStorage);
    let securityContext: SecurityContext = new SecurityContext(eventAggregator, httpClient, router, i18n, storage);
    container.registerInstance(SecurityContext, securityContext);
    if (pluginConfiguration) {
        pluginConfiguration(securityContext);
    }
    return securityContext.authenticate(new ImplicitCredential()).then(null, failure => {
        return storage.get(securityContext.configuration.authorizationTokenStorageKey).then(token => {
            return securityContext.authenticate(new TokenCredential(token));
        }).then(null, tokenNotValid => securityContext.deleteAndRevokeToken());
    }).then(null, failure => console.debug(failure));
}

export {
    SecurityContext,
    AuthorizeRequest,
    AuthorizeStep,
    Tenant,
    Principal,
    SecurityRole,
    Credential,
    ImplicitCredential,
    PasswordCredential,
    ProviderCredential,
    TokenCredential
};
