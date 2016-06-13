import { HttpHeaders } from "http-utils";
export class BearerAuthenticator {
    constructor(tokenCredential) {
        this.authorizationData = BearerAuthenticator.SCHEME + " " + tokenCredential.getToken();
    }
    authorizeMessage(message) {
        message.headers.add(HttpHeaders.AUTHORIZATION, this.authorizationData);
        return message;
    }
    getScheme() {
        return BearerAuthenticator.SCHEME;
    }
}
BearerAuthenticator.SCHEME = "Bearer";
//# sourceMappingURL=bearer-authenticator.js.map