define(["exports", "aurelia-event-aggregator", "aurelia-router", "aurelia-http-client", "aurelia-i18n", "./security-context", "./authorize-request", "./authorize-step", "./implicit-credential", "./password-credential", "./provider-credential", "./token-credential", "aurelia-storage"], function (exports, _aureliaEventAggregator, _aureliaRouter, _aureliaHttpClient, _aureliaI18n, _securityContext, _authorizeRequest, _authorizeStep, _implicitCredential, _passwordCredential, _providerCredential, _tokenCredential, _aureliaStorage) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.TokenCredential = exports.ProviderCredential = exports.PasswordCredential = exports.ImplicitCredential = exports.AuthorizeStep = exports.AuthorizeRequest = exports.SecurityContext = undefined;
    exports.configure = configure;
    function configure(frameworkConfiguration, pluginConfiguration) {
        var container = frameworkConfiguration.container;
        var eventAggregator = container.get(_aureliaEventAggregator.EventAggregator);
        var router = container.get(_aureliaRouter.Router);
        var httpClient = container.get(_aureliaHttpClient.HttpClient);
        var i18n = container.get(_aureliaI18n.I18N);
        var storage = container.get(_aureliaStorage.LocalStorage);
        var securityContext = new _securityContext.SecurityContext(eventAggregator, httpClient, router, i18n, storage);
        container.registerInstance(_securityContext.SecurityContext, securityContext);
        if (pluginConfiguration) {
            pluginConfiguration(securityContext);
        }
        return securityContext.authenticate(new _implicitCredential.ImplicitCredential()).then(null, function (failure) {
            return storage.get(securityContext.configuration.authorizationTokenStorageKey).then(function (token) {
                return securityContext.authenticate(new _tokenCredential.TokenCredential(token));
            }).then(null, function (tokenNotValid) {
                return securityContext.deleteAndRevokeToken();
            });
        }).then(null, function (failure) {
            return console.debug(failure);
        });
    }
    exports.SecurityContext = _securityContext.SecurityContext;
    exports.AuthorizeRequest = _authorizeRequest.AuthorizeRequest;
    exports.AuthorizeStep = _authorizeStep.AuthorizeStep;
    exports.ImplicitCredential = _implicitCredential.ImplicitCredential;
    exports.PasswordCredential = _passwordCredential.PasswordCredential;
    exports.ProviderCredential = _providerCredential.ProviderCredential;
    exports.TokenCredential = _tokenCredential.TokenCredential;
});