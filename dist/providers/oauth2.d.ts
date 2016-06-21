import { Provider } from "../provider";
export declare class OAuth2 implements Provider {
    configuration: OAuth2Configuration;
    private name;
    private title;
    private applicationId;
    private applicationSecret;
    private accessToken;
    constructor(name: string, title: string, applicationId: string, configuration: OAuth2Configuration);
    requestAuthorization(...scope: string[]): void;
    private generateState();
}
export declare class OAuth2Configuration {
    authorizationRequestUrl: string;
    applicationIdParamName: string;
    redirectUriParamName: string;
    scopeParamName: string;
    stateParamName: string;
    constructor(configuration: Object);
}
