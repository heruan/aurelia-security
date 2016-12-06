import { HttpRequestMessage } from "aurelia-http-client";
import { Authenticator } from "./authenticator";
import { PasswordCredential } from "./password-credential";
export declare class BasicAuthenticator implements Authenticator {
    private static SCHEME;
    private static DELIMITER;
    private authorizationData;
    constructor(passwordCredential: PasswordCredential);
    authorizeMessage(message: HttpRequestMessage): HttpRequestMessage;
    getScheme(): string;
}
