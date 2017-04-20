"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var security_context_1 = require("./security-context");
exports.SecurityContext = security_context_1.SecurityContext;
var authorize_request_1 = require("./authorize-request");
exports.AuthorizeRequest = authorize_request_1.AuthorizeRequest;
var authorize_step_1 = require("./authorize-step");
exports.AuthorizeStep = authorize_step_1.AuthorizeStep;
var implicit_credential_1 = require("./implicit-credential");
exports.ImplicitCredential = implicit_credential_1.ImplicitCredential;
var password_credential_1 = require("./password-credential");
exports.PasswordCredential = password_credential_1.PasswordCredential;
var provider_credential_1 = require("./provider-credential");
exports.ProviderCredential = provider_credential_1.ProviderCredential;
var token_credential_1 = require("./token-credential");
exports.TokenCredential = token_credential_1.TokenCredential;
var aurelia_storage_1 = require("aurelia-storage");
var preferences_1 = require("./preferences");
exports.Preferences = preferences_1.Preferences;
function configure(frameworkConfiguration, pluginConfiguration) {
    var container = frameworkConfiguration.container;
    var storage = container.get(aurelia_storage_1.LocalStorage);
    var securityContext = container.get(security_context_1.SecurityContext);
    if (pluginConfiguration) {
        pluginConfiguration(securityContext);
    }
    return securityContext.authenticate(new implicit_credential_1.ImplicitCredential()).then(null, function (failure) {
        return storage.get(securityContext.configuration.authorizationTokenStorageKey).then(function (token) {
            return securityContext.authenticate(new token_credential_1.TokenCredential(token));
        }).then(null, function (tokenNotValid) { return securityContext.deleteAndRevokeToken(); });
    }).then(null, function (failure) { return console.debug(failure); });
}
exports.configure = configure;

//# sourceMappingURL=index.js.map
