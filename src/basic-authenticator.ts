import {HttpRequestMessage} from "aurelia-http-client";
import {HttpHeaders} from "http-utils";
import {Authenticator} from "./authenticator";
import {PasswordCredential} from "./password-credential";

export class BasicAuthenticator implements Authenticator {

    private static SCHEME: string = "Basic";

    private static DELIMITER: string = ":";

    private authorizationData: string;

    constructor(passwordCredential: PasswordCredential) {
        this.authorizationData = BasicAuthenticator.SCHEME + " " + btoa([
            passwordCredential.getIdentity(), passwordCredential.getPassword()
        ].join(BasicAuthenticator.DELIMITER));
    }

    public authorizeMessage(message: HttpRequestMessage): HttpRequestMessage {
        message.headers.add(HttpHeaders.AUTHORIZATION, this.authorizationData);
        return message;
    }

    public getScheme(): string {
        return BasicAuthenticator.SCHEME;
    }

}
