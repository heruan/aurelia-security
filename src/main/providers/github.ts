import { Provider } from "../provider";
import { OAuth2, OAuth2Configuration } from "./oauth2";

export class GitHub extends OAuth2 implements Provider {

    public constructor(applicationId: string) {
        super("github", "GitHub", applicationId, new OAuth2Configuration({
            authorizationRequestUrl: "https://github.com/login/oauth/authorize"
        }));
    }

}
