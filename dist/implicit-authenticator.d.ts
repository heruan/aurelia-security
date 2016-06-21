import { HttpRequestMessage } from "aurelia-http-client";
import { Authenticator } from "./authenticator";
export declare class ImplicitAuthenticator implements Authenticator {
    private static SCHEME;
    authorizeMessage(message: HttpRequestMessage): HttpRequestMessage;
    getScheme(): string;
}
