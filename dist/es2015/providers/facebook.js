import { OAuth2, OAuth2Configuration } from "./oauth2";
export class Facebook extends OAuth2 {
    constructor(applicationId) {
        super("facebook", "Facebook", applicationId, new OAuth2Configuration({
            authorizationRequestUrl: "https://www.facebook.com/dialog/oauth"
        }));
    }
}
//# sourceMappingURL=facebook.js.map