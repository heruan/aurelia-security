import { Provider } from "../provider";
import { OAuth2, OAuth2Configuration } from "./oauth2";

export class Facebook extends OAuth2 implements Provider {

    public constructor(applicationId: string) {
        super("facebook", "Facebook", applicationId, new OAuth2Configuration({
            authorizationRequestUrl: "https://www.facebook.com/dialog/oauth"
        }));
    }

}
