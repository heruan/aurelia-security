export class OAuth2 {
    constructor(name, title, applicationId, configuration) {
        this.name = name;
        this.title = title;
        this.applicationId = applicationId;
        this.configuration = configuration;
    }
    requestAuthorization(...scope) {
        let redirectUri = window.location.origin + window.location.pathname + `?provider=${this.name}`;
        let url = this.configuration.authorizationRequestUrl + "?"
            + this.configuration.redirectUriParamName + "=" + encodeURIComponent(redirectUri) + "&"
            + this.configuration.applicationIdParamName + "=" + this.applicationId + "&"
            + this.configuration.scopeParamName + "=" + scope.join(",") + "&"
            + this.configuration.stateParamName + "=" + this.generateState();
        window.location.href = url;
    }
    generateState() {
        return window.crypto.getRandomValues(new Uint32Array(1))[0];
    }
}
export class OAuth2Configuration {
    constructor(configuration) {
        this.applicationIdParamName = "client_id";
        this.redirectUriParamName = "redirect_uri";
        this.scopeParamName = "scope";
        this.stateParamName = "state";
        Object.assign(this, configuration);
    }
}
//# sourceMappingURL=oauth2.js.map