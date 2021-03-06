import { FrameworkConfiguration } from "aurelia-framework";
import { Container } from "aurelia-dependency-injection";
import { EventAggregator } from "aurelia-event-aggregator";
import { Router } from "aurelia-router";
import { HttpClient } from "aurelia-http-client";
import { SecurityContext } from "./security-context";
import { AuthorizeRequest } from "./authorize-request";
import { AuthorizeStep } from "./authorize-step";
import { Principal } from "./principal";
import { SecurityRole } from "./security-role";
import { Credential } from "./credential";
import { ImplicitCredential } from "./implicit-credential";
import { PasswordCredential } from "./password-credential";
import { ProviderCredential } from "./provider-credential";
import { TokenCredential } from "./token-credential";
import { LocalStorage } from "aurelia-storage";
import { Preferences } from "./preferences";

export function configure(frameworkConfiguration: FrameworkConfiguration, pluginConfiguration: Function) {
    let container: Container = frameworkConfiguration.container;
    let storage: LocalStorage = container.get(LocalStorage);
    let securityContext: SecurityContext = container.get(SecurityContext);
    if (pluginConfiguration) {
        pluginConfiguration(securityContext);
    }
    return securityContext.authenticate(new ImplicitCredential()).then(null, failure => {
        return storage.get<string>(securityContext.configuration.authorizationTokenStorageKey).then(token => {
            return securityContext.authenticate(new TokenCredential(token));
        }).then(null, tokenNotValid => securityContext.deleteAndRevokeToken());
    }).then(null, failure => console.debug(failure));
}

export {
    SecurityContext,
    AuthorizeRequest,
    AuthorizeStep,
    Principal,
    SecurityRole,
    Credential,
    ImplicitCredential,
    PasswordCredential,
    ProviderCredential,
    TokenCredential,
    Preferences
};
