import { HttpRequestMessage } from "aurelia-http-client";
import { Authenticator } from "./authenticator";
import { TokenCredential } from "./token-credential";
export declare class BearerAuthenticator implements Authenticator {
    private static SCHEME;
    private authorizationData;
    constructor(tokenCredential: TokenCredential);
    authorizeMessage(message: HttpRequestMessage): HttpRequestMessage;
    getScheme(): string;
}
