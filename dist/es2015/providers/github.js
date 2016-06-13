import { OAuth2, OAuth2Configuration } from "./oauth2";
export class GitHub extends OAuth2 {
    constructor(applicationId) {
        super("github", "GitHub", applicationId, new OAuth2Configuration({
            authorizationRequestUrl: "https://github.com/login/oauth/authorize"
        }));
    }
}
//# sourceMappingURL=github.js.map