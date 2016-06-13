import { EventAggregator } from "aurelia-event-aggregator";
import { Router } from "aurelia-router";
import { HttpClient } from "aurelia-http-client";
import { I18N } from "aurelia-i18n";
import { SecurityContext } from "./security-context";
import { AuthorizeRequest } from "./authorize-request";
import { AuthorizeStep } from "./authorize-step";
import { ImplicitCredential } from "./implicit-credential";
import { PasswordCredential } from "./password-credential";
import { ProviderCredential } from "./provider-credential";
import { TokenCredential } from "./token-credential";
import { LocalStorage } from "aurelia-storage";
export function configure(frameworkConfiguration, pluginConfiguration) {
    let container = frameworkConfiguration.container;
    let eventAggregator = container.get(EventAggregator);
    let router = container.get(Router);
    let httpClient = container.get(HttpClient);
    let i18n = container.get(I18N);
    let storage = container.get(LocalStorage);
    let securityContext = new SecurityContext(eventAggregator, httpClient, router, i18n, storage);
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
export { SecurityContext, AuthorizeRequest, AuthorizeStep, ImplicitCredential, PasswordCredential, ProviderCredential, TokenCredential };
//# sourceMappingURL=index.js.map