import { HttpRequestMessage} from "aurelia-http-client";
import { HttpHeaders} from "aurelia-http-utils";
import { Authenticator} from "./authenticator";
import { TokenCredential} from "./token-credential";

export class BearerAuthenticator implements Authenticator {

    private static SCHEME: string = "Bearer";

    private authorizationData: string;

    constructor(tokenCredential: TokenCredential) {
        this.authorizationData = BearerAuthenticator.SCHEME + " " + tokenCredential.getToken();
    }

    public authorizeMessage(message: HttpRequestMessage): HttpRequestMessage {
        message.headers.add(HttpHeaders.AUTHORIZATION, this.authorizationData);
        return message;
    }

    public getScheme(): string {
        return BearerAuthenticator.SCHEME;
    }

}
