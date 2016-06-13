"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TokenCredential = exports.ProviderCredential = exports.PasswordCredential = exports.ImplicitCredential = exports.AuthorizeStep = exports.AuthorizeRequest = exports.SecurityContext = undefined;
exports.configure = configure;

var _aureliaEventAggregator = require("aurelia-event-aggregator");

var _aureliaRouter = require("aurelia-router");

var _aureliaHttpClient = require("aurelia-http-client");

var _aureliaI18n = require("aurelia-i18n");

var _securityContext = require("./security-context");

var _authorizeRequest = require("./authorize-request");

var _authorizeStep = require("./authorize-step");

var _implicitCredential = require("./implicit-credential");

var _passwordCredential = require("./password-credential");

var _providerCredential = require("./provider-credential");

var _tokenCredential = require("./token-credential");

var _aureliaStorage = require("aurelia-storage");

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