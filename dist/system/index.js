"use strict";

System.register(["aurelia-event-aggregator", "aurelia-router", "aurelia-http-client", "aurelia-i18n", "./security-context", "./authorize-request", "./authorize-step", "./implicit-credential", "./password-credential", "./provider-credential", "./token-credential", "aurelia-storage"], function (_export, _context) {
    "use strict";

    var EventAggregator, Router, HttpClient, I18N, SecurityContext, AuthorizeRequest, AuthorizeStep, ImplicitCredential, PasswordCredential, ProviderCredential, TokenCredential, LocalStorage;
    return {
        setters: [function (_aureliaEventAggregator) {
            EventAggregator = _aureliaEventAggregator.EventAggregator;
        }, function (_aureliaRouter) {
            Router = _aureliaRouter.Router;
        }, function (_aureliaHttpClient) {
            HttpClient = _aureliaHttpClient.HttpClient;
        }, function (_aureliaI18n) {
            I18N = _aureliaI18n.I18N;
        }, function (_securityContext) {
            SecurityContext = _securityContext.SecurityContext;
        }, function (_authorizeRequest) {
            AuthorizeRequest = _authorizeRequest.AuthorizeRequest;
        }, function (_authorizeStep) {
            AuthorizeStep = _authorizeStep.AuthorizeStep;
        }, function (_implicitCredential) {
            ImplicitCredential = _implicitCredential.ImplicitCredential;
        }, function (_passwordCredential) {
            PasswordCredential = _passwordCredential.PasswordCredential;
        }, function (_providerCredential) {
            ProviderCredential = _providerCredential.ProviderCredential;
        }, function (_tokenCredential) {
            TokenCredential = _tokenCredential.TokenCredential;
        }, function (_aureliaStorage) {
            LocalStorage = _aureliaStorage.LocalStorage;
        }],
        execute: function () {
            function configure(frameworkConfiguration, pluginConfiguration) {
                var container = frameworkConfiguration.container;
                var eventAggregator = container.get(EventAggregator);
                var router = container.get(Router);
                var httpClient = container.get(HttpClient);
                var i18n = container.get(I18N);
                var storage = container.get(LocalStorage);
                var securityContext = new SecurityContext(eventAggregator, httpClient, router, i18n, storage);
                container.registerInstance(SecurityContext, securityContext);
                if (pluginConfiguration) {
                    pluginConfiguration(securityContext);
                }
                return securityContext.authenticate(new ImplicitCredential()).then(null, function (failure) {
                    return storage.get(securityContext.configuration.authorizationTokenStorageKey).then(function (token) {
                        return securityContext.authenticate(new TokenCredential(token));
                    }).then(null, function (tokenNotValid) {
                        return securityContext.deleteAndRevokeToken();
                    });
                }).then(null, function (failure) {
                    return console.debug(failure);
                });
            }

            _export("configure", configure);

            _export("SecurityContext", SecurityContext);

            _export("AuthorizeRequest", AuthorizeRequest);

            _export("AuthorizeStep", AuthorizeStep);

            _export("ImplicitCredential", ImplicitCredential);

            _export("PasswordCredential", PasswordCredential);

            _export("ProviderCredential", ProviderCredential);

            _export("TokenCredential", TokenCredential);
        }
    };
});