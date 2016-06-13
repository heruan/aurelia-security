import {Provider} from "../provider";
import {Principal} from "../principal";

export class OAuth2 implements Provider {

    public configuration: OAuth2Configuration;

    private name: string;

    private title: string;

    private applicationId: string;

    private applicationSecret: string;

    private accessToken: string;

    public constructor(name: string, title: string, applicationId: string, configuration: OAuth2Configuration) {
        this.name = name;
        this.title = title;
        this.applicationId = applicationId;
        this.configuration = configuration;
    }

    public requestAuthorization(...scope: string[]): void {
        let redirectUri = window.location.origin + window.location.pathname + `?provider=${this.name}`;
        let url = this.configuration.authorizationRequestUrl + "?"
        + this.configuration.redirectUriParamName + "=" + encodeURIComponent(redirectUri) + "&"
        + this.configuration.applicationIdParamName + "=" + this.applicationId + "&"
        + this.configuration.scopeParamName + "=" + scope.join(",") + "&"
        + this.configuration.stateParamName + "=" + this.generateState();
        window.location.href = url;
    }

    private generateState() {
        return window.crypto.getRandomValues(new Uint32Array(1))[0];
    }

}

export class OAuth2Configuration {

    public authorizationRequestUrl: string;

    public applicationIdParamName: string = "client_id";

    public redirectUriParamName: string = "redirect_uri";

    public scopeParamName: string = "scope";

    public stateParamName: string = "state";

    public constructor(configuration: Object) {
        Object.assign(this, configuration);
    }

}
