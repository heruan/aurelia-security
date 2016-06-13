import { HttpHeaders } from "http-utils";
export class BasicAuthenticator {
    constructor(passwordCredential) {
        this.authorizationData = BasicAuthenticator.SCHEME + " " + btoa([
            passwordCredential.getIdentity(), passwordCredential.getPassword()
        ].join(BasicAuthenticator.DELIMITER));
    }
    authorizeMessage(message) {
        message.headers.add(HttpHeaders.AUTHORIZATION, this.authorizationData);
        return message;
    }
    getScheme() {
        return BasicAuthenticator.SCHEME;
    }
}
BasicAuthenticator.SCHEME = "Basic";
BasicAuthenticator.DELIMITER = ":";
//# sourceMappingURL=basic-authenticator.js.map